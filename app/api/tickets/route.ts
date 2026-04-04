import { prisma } from "@/lib/prisma";
import { runMulterFields } from "@/lib/multer";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// GET /api/tickets?filter=priority&status=open&page=1&limit=20
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");
  const status = searchParams.get("status");
  const page   = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit  = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (filter === "priority") {
    where.priority = true;
    where.status = { notIn: ["resolved", "not_interested"] };
  } else if (status) {
    where.status = status;
  }

  const [tickets, total] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      include: { agent: true },
      orderBy: [{ priority: "desc" }, { created_at: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.ticket.count({ where }),
  ]);

  return NextResponse.json({
    data: tickets,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

// POST /api/tickets - create ticket (multipart/form-data via multer)
export async function POST(req: NextRequest) {
  const { nodeReq, files } = await runMulterFields(req, [
    { name: "document", maxCount: 1 },
    { name: "payment_screenshot", maxCount: 1 },
  ]);

  const body = nodeReq as unknown as { body: Record<string, string> };
  const fields = body.body ?? {};

  const name           = fields.name;
  const contact_number = fields.contact_number;
  const address        = fields.address;
  const board          = fields.board;
  const ticket_type    = (fields.ticket_type ?? "offline") as "online" | "offline";
  const priority       = fields.priority === "true";

  const documentFile   = files["document"]?.[0];
  const screenshotFile = files["payment_screenshot"]?.[0];

  if (!name || !contact_number || !address || !board || !documentFile) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (priority && !screenshotFile) {
    return NextResponse.json(
      { error: "Payment screenshot is required for priority tickets." },
      { status: 400 }
    );
  }

  const ticket = await prisma.ticket.create({
    data: {
      name,
      contact_number,
      address,
      board,
      ticket_type,
      priority,
      document_url: `/user_documents/${documentFile.filename}`,
      ...(screenshotFile && {
        payment_screenshot_url: `/user_documents/${screenshotFile.filename}`,
      }),
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tickets/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { agent: true },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

// PATCH /api/tickets/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const ticket = await prisma.ticket.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.address !== undefined && { address: body.address }),
      ...(body.ticket_type !== undefined && { ticket_type: body.ticket_type }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.contact_number !== undefined && { contact_number: body.contact_number }),
      ...(body.board !== undefined && { board: body.board }),
      ...(body.exam_detail !== undefined && { exam_detail: body.exam_detail }),
      ...(body.user_call_comments !== undefined && { user_call_comments: body.user_call_comments }),
      ...(body.document_url !== undefined && { document_url: body.document_url }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.commission_money !== undefined && { commission_money: body.commission_money }),
      ...(body.commission_received !== undefined && { commission_received: body.commission_received }),
      ...(body.master_commission_pending !== undefined && { master_commission_pending: body.master_commission_pending }),
      ...(body.agent_id !== undefined && { agent_id: body.agent_id }),
    },
    include: { agent: true },
  });

  return NextResponse.json(ticket);
}

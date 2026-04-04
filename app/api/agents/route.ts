import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/agents
export async function GET() {
  const agents = await prisma.agent.findMany({
    orderBy: { created_at: "desc" },
    include: { _count: { select: { tickets: true } } },
  });
  return NextResponse.json(agents);
}

// POST /api/agents - create agent
export async function POST(req: NextRequest) {
  const { name, contact_number, total_commission, first_commission, second_commission } =
    await req.json();

  if (!name || !contact_number) {
    return NextResponse.json(
      { error: "Name and contact number are required." },
      { status: 400 }
    );
  }

  const agent = await prisma.agent.create({
    data: {
      name,
      contact_number,
      total_commission: total_commission ?? 0,
      first_commission: first_commission ?? 0,
      second_commission: second_commission ?? 0,
    },
  });
  return NextResponse.json(agent, { status: 201 });
}

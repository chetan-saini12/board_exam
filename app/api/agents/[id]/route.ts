import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/agents/[id] - update agent details
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, contact_number, total_commission, first_commission, second_commission } =
    await req.json();

  const agent = await prisma.agent.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(contact_number !== undefined && { contact_number }),
      ...(total_commission !== undefined && { total_commission: Number(total_commission) }),
      ...(first_commission !== undefined && { first_commission: Number(first_commission) }),
      ...(second_commission !== undefined && { second_commission: Number(second_commission) }),
    },
  });
  return NextResponse.json(agent);
}

// DELETE /api/agents/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.agent.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

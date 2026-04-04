import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TicketDetail from "./TicketDetail";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { agent: true },
  });

  const agents = await prisma.agent.findMany({ orderBy: { name: "asc" } });

  if (!ticket) notFound();

  return <TicketDetail ticket={ticket} agents={agents} />;
}

import { prisma } from "@/lib/prisma";
import AgentsClient from "./AgentsClient";

export default async function AdminAgentsPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { created_at: "desc" },
    include: { _count: { select: { tickets: true } } },
  });

  return <AgentsClient initialAgents={agents} />;
}

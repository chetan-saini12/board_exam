import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import FilterBar from "./FilterBar";
import Pagination from "./Pagination";

const STATUS_COLORS: Record<string, string> = {
  open:           "bg-blue-100 text-blue-700",
  on_going:       "bg-yellow-100 text-yellow-700",
  resolved:       "bg-green-100 text-green-700",
  not_interested: "bg-gray-100 text-gray-500",
};

const LIMIT = 20;

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; status?: string; page?: string }>;
}) {
  const { filter, status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

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
      skip: (page - 1) * LIMIT,
      take: LIMIT,
    }),
    prisma.ticket.count({ where }),
  ]);

  const totalPages = Math.ceil(total / LIMIT);
  const activeFilter = filter === "priority" ? "priority" : status ?? "all";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tickets</h1>
          <p className="text-sm text-gray-400 mt-1">
            {total} total · page {page} of {totalPages}
          </p>
        </div>
        <Link
          href="/contact"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors"
        >
          + New Ticket
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="mb-6">
        <Suspense>
          <FilterBar active={activeFilter} />
        </Suspense>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-24 text-gray-400">No tickets found.</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Board</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Agent</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {ticket.name}
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                      {ticket.contact_number}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {ticket.board}
                    </td>
                    <td className="px-5 py-4 text-gray-500 capitalize whitespace-nowrap">
                      {ticket.ticket_type}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          STATUS_COLORS[ticket.status] ?? "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {ticket.priority ? (
                        <span className="text-yellow-500 font-bold">⚡ Yes</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                      {ticket.agent?.name ?? (
                        <span className="text-gray-300">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                      {new Date(ticket.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/tickets/${ticket.id}`}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Suspense>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}

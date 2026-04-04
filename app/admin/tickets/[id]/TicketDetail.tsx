"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { Ticket, Agent } from "@/app/generated/prisma/client";

const STATUSES = ["open", "on_going", "resolved", "not_interested"];
const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  on_going: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  not_interested: "bg-gray-100 text-gray-500",
};

type Props = {
  ticket: Ticket & { agent: Agent | null };
  agents: Agent[];
};

export default function TicketDetail({ ticket, agents }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: ticket.name,
    contact_number: ticket.contact_number,
    address: ticket.address,
    board: ticket.board,
    ticket_type: ticket.ticket_type,
    status: ticket.status,
    exam_detail: ticket.exam_detail ?? "",
    user_call_comments: ticket.user_call_comments ?? "",
    priority: ticket.priority,
    commission_money: ticket.commission_money,
    commission_received: ticket.commission_received,
    master_commission_pending: ticket.master_commission_pending,
    agent_id: ticket.agent_id ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.patch(`/tickets/${ticket.id}`, {
        ...form,
        priority: Boolean(form.priority),
        commission_money: Number(form.commission_money),
        commission_received: Number(form.commission_received),
        master_commission_pending: Number(form.master_commission_pending),
        agent_id: form.agent_id || null,
      });
      setEditing(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const Field = ({
    label,
    field,
    type = "text",
    textarea = false,
  }: {
    label: string;
    field: keyof typeof form;
    type?: string;
    textarea?: boolean;
  }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      {editing ? (
        textarea ? (
          <textarea
            name={field}
            value={form[field] as string}
            onChange={handleChange}
            rows={3}
            className="px-3 py-2 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        ) : (
          <input
            type={type}
            name={field}
            value={form[field] as string | number}
            onChange={handleChange}
            className="px-3 py-2 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      ) : (
        <span className="text-gray-800 text-sm">
          {String(form[field]) || <span className="text-gray-300">—</span>}
        </span>
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600">
          ← Tickets
        </Link>
        <span className="text-gray-200">/</span>
        <h1 className="text-2xl font-extrabold text-gray-900">{ticket.name}</h1>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
            STATUS_COLORS[ticket.status] ?? "bg-gray-100 text-gray-500"
          }`}
        >
          {ticket.status.replace("_", " ")}
        </span>
        {ticket.priority && (
          <span className="text-yellow-500 font-bold text-sm">⚡ Priority</span>
        )}
        <div className="ml-auto flex gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-2 gap-5">
            <Field label="Full Name" field="name" />
            <Field label="Contact Number" field="contact_number" type="tel" />
            <Field label="Board" field="board" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Ticket Type
              </span>
              {editing ? (
                <select
                  name="ticket_type"
                  value={form.ticket_type}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              ) : (
                <span className="text-gray-800 text-sm capitalize">{form.ticket_type}</span>
              )}
            </div>
            <div className="col-span-2">
              <Field label="Address" field="address" textarea />
            </div>
            <div className="col-span-2">
              <Field label="Exam Detail" field="exam_detail" textarea />
            </div>
            <div className="col-span-2">
              <Field label="Call Comments" field="user_call_comments" textarea />
            </div>
          </div>

          {/* Document */}
          {ticket.document_url && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Uploaded Document
              </span>
              <a
                href={ticket.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                📄 View Document
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Status & Priority */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Status
              </span>
              {editing ? (
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize w-fit ${
                    STATUS_COLORS[form.status] ?? "bg-gray-100 text-gray-500"
                  }`}
                >
                  {form.status.replace("_", " ")}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Priority
              </span>
              {editing ? (
                <input
                  type="checkbox"
                  name="priority"
                  checked={form.priority}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600"
                />
              ) : (
                <span className={form.priority ? "text-yellow-500 font-bold" : "text-gray-300"}>
                  {form.priority ? "⚡ Yes" : "—"}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Agent
              </span>
              {editing ? (
                <select
                  name="agent_id"
                  value={form.agent_id}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-gray-800 text-sm">
                  {ticket.agent?.name ?? <span className="text-gray-300">Unassigned</span>}
                </span>
              )}
            </div>
          </div>

          {/* Commission */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-gray-700">Commission</h3>
            <Field label="Total (₹)" field="commission_money" type="number" />
            <Field label="Received (₹)" field="commission_received" type="number" />
            <Field label="Pending (₹)" field="master_commission_pending" type="number" />
          </div>

          {/* Meta */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Created</span>
              <span>
                {new Date(ticket.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Updated</span>
              <span>
                {new Date(ticket.updated_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>ID</span>
              <span className="font-mono text-gray-300">{ticket.id.slice(0, 8)}…</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

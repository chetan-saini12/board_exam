"use client";

import { useState } from "react";
import api from "@/lib/api";

type Agent = {
  id: string;
  name: string;
  contact_number: string;
  total_commission: number;
  first_commission: number;
  second_commission: number;
  _count: { tickets: number };
};

const EMPTY_FORM = {
  name: "",
  contact_number: "",
  total_commission: 0,
  first_commission: 0,
  second_commission: 0,
};

export default function AgentsClient({ initialAgents }: { initialAgents: Agent[] }) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editLoading, setEditLoading] = useState(false);

  // ── Add ─────────────────────────────────────────────
  function handleAddChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    try {
      const { data } = await api.post("/agents", {
        ...addForm,
        total_commission: Number(addForm.total_commission),
        first_commission: Number(addForm.first_commission),
        second_commission: Number(addForm.second_commission),
      });
      setAgents((p) => [{ ...data, _count: { tickets: 0 } }, ...p]);
      setAddForm(EMPTY_FORM);
      setShowAdd(false);
    } finally {
      setAddLoading(false);
    }
  }

  // ── Edit ─────────────────────────────────────────────
  function startEdit(agent: Agent) {
    setEditId(agent.id);
    setEditForm({
      name: agent.name,
      contact_number: agent.contact_number,
      total_commission: agent.total_commission,
      first_commission: agent.first_commission,
      second_commission: agent.second_commission,
    });
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleEditSave(id: string) {
    setEditLoading(true);
    try {
      const { data } = await api.patch(`/agents/${id}`, {
        ...editForm,
        total_commission: Number(editForm.total_commission),
        first_commission: Number(editForm.first_commission),
        second_commission: Number(editForm.second_commission),
      });
      setAgents((p) =>
        p.map((a) => (a.id === id ? { ...data, _count: a._count } : a))
      );
      setEditId(null);
    } finally {
      setEditLoading(false);
    }
  }

  // ── Delete ───────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm("Delete this agent?")) return;
    await api.delete(`/agents/${id}`);
    setAgents((p) => p.filter((a) => a.id !== id));
  }

  const inputCls =
    "w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Agents</h1>
          <p className="text-sm text-gray-400 mt-1">{agents.length} total</p>
        </div>
        <button
          onClick={() => setShowAdd((p) => !p)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors"
        >
          {showAdd ? "Cancel" : "+ Add Agent"}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Name *</label>
            <input name="name" value={addForm.name} onChange={handleAddChange} required placeholder="Agent name" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Contact *</label>
            <input name="contact_number" value={addForm.contact_number} onChange={handleAddChange} required placeholder="+91 98765 43210" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Total Commission (₹)</label>
            <input type="number" name="total_commission" value={addForm.total_commission} onChange={handleAddChange} min={0} className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">First Commission (₹)</label>
            <input type="number" name="first_commission" value={addForm.first_commission} onChange={handleAddChange} min={0} className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Second Commission (₹)</label>
            <input type="number" name="second_commission" value={addForm.second_commission} onChange={handleAddChange} min={0} className={inputCls} />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={addLoading}
              className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {addLoading ? "Saving…" : "Create Agent"}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {agents.length === 0 ? (
        <div className="text-center py-24 text-gray-400">No agents yet.</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Tickets</th>
                  <th className="px-5 py-3">Total (₹)</th>
                  <th className="px-5 py-3">First (₹)</th>
                  <th className="px-5 py-3">Second (₹)</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {agents.map((agent) =>
                  editId === agent.id ? (
                    // ── Edit row ──
                    <tr key={agent.id} className="bg-blue-50/40">
                      <td className="px-3 py-3">
                        <input name="name" value={editForm.name} onChange={handleEditChange} className={inputCls} />
                      </td>
                      <td className="px-3 py-3">
                        <input name="contact_number" value={editForm.contact_number} onChange={handleEditChange} className={inputCls} />
                      </td>
                      <td className="px-5 py-3 text-gray-400">{agent._count.tickets}</td>
                      <td className="px-3 py-3">
                        <input type="number" name="total_commission" value={editForm.total_commission} onChange={handleEditChange} min={0} className={inputCls} />
                      </td>
                      <td className="px-3 py-3">
                        <input type="number" name="first_commission" value={editForm.first_commission} onChange={handleEditChange} min={0} className={inputCls} />
                      </td>
                      <td className="px-3 py-3">
                        <input type="number" name="second_commission" value={editForm.second_commission} onChange={handleEditChange} min={0} className={inputCls} />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSave(agent.id)}
                            disabled={editLoading}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                          >
                            {editLoading ? "…" : "Save"}
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // ── View row ──
                    <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">{agent.name}</td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{agent.contact_number}</td>
                      <td className="px-5 py-4 text-gray-500">{agent._count.tickets}</td>
                      <td className="px-5 py-4 text-gray-700 font-semibold">₹{agent.total_commission.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4 text-gray-500">₹{agent.first_commission.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4 text-gray-500">₹{agent.second_commission.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(agent)}
                            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(agent.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

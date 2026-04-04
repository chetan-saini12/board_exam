"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const FILTERS = [
  { key: "all",             label: "All" },
  { key: "priority",        label: "⚡ Priority" },
  { key: "open",            label: "Open" },
  { key: "on_going",        label: "On Going" },
  { key: "resolved",        label: "Resolved" },
  { key: "not_interested",  label: "Not Interested" },
];

export default function FilterBar({ active }: { active: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") {
      params.delete("filter");
      params.delete("status");
    } else if (key === "priority") {
      params.set("filter", "priority");
      params.delete("status");
    } else {
      params.set("status", key);
      params.delete("filter");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => setFilter(f.key)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            active === f.key
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

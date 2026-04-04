"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  totalPages: number;
};

export default function Pagination({ page, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function go(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  // Build page window: always show first, last, current ±2
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - 2 && i <= page + 2)
    ) {
      pages.push(i);
    } else if (
      (i === page - 3 && page - 3 > 1) ||
      (i === page + 3 && page + 3 < totalPages)
    ) {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => go(p as number)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                p === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
}

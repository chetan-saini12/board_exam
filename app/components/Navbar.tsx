"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.startsWith("/admin");

  async function handleLogout() {
    await api.post("/auth/logout");
    router.push("/login");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-blue-700 tracking-tight">
          PassBoardExam
        </Link>

        <div className="md:flex items-center gap-6 text-base font-bold text-gray-600">
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 text-sm font-semibold bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <a href="#steps" className="hidden md:block hover:text-blue-600 transition-colors">
                How it works?
              </a>
              <Link
                href="/contact"
                className="px-3 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-full"
              >
                Contact Us
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

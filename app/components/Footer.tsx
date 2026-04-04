import Link from "next/link";

export default function Footer() {
  return (
    <footer id="chat" className="bg-gray-950 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white font-extrabold text-xl">
          PassBoardExams.in
        </div>
        <div className="text-sm text-center">
          © 2026 PassBoardExam. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm">
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact Us
          </Link>
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin Login
          </Link>
          <a href="#steps" className="hover:text-white transition-colors">
            How It Works
          </a>
        </div>
      </div>
    </footer>
  );
}

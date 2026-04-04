import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PassBoardExams.in — Board Exam Assistance",
  description: "Get special care and assistance to pass your board exams. Contact our team today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col">
          <Navbar />
          {children}
        </body>
    </html>
  );
}

import Link from "next/link";
import Image from "next/image";
import Footer from "./components/Footer";
import HowItWorks from "./components/HowItWorks";
import StudentExperiences from "./components/StudentExperiences";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-linear-to-r from-white via-blue-100 to-blue-100 pt-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 py-20">
          {/* Text */}
          <div className="flex-1 flex flex-col items-start gap-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              Board Exam Assistance
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Board Exam may Fail
              <br />
              <span className="text-blue-600">hogay kya?</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-md leading-relaxed">
              Don’t worry, we won’t make you study. We’ve got connections that
              will help you pass by any means necessary.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/contact"
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-md hover:bg-blue-700 transition-colors text-lg"
              >
                Pass Me!
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors text-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-3xl shadow-2xl overflow-hidden relative">
              <Image
                src="/board_exam_home_page.jpg"
                alt="Student getting board exam assistance"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <StudentExperiences />
      <Footer />
    </>
  );
}

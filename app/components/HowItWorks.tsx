import Link from "next/link";

const steps = [
  {
    num: 1,
    title: "Contact Us",
    desc: "Click the Contact Us or Pass Me button to get started with your application.",
  },
  {
    num: 2,
    title: "Fill the Form",
    desc: "Fill in your name, contact number, board details, and upload your result.",
  },
  {
    num: 3,
    title: "Document Verification",
    desc: "Our team will carefully verify your submitted documents.",
  },
  {
    num: 4,
    title: "Receive Exam Details",
    desc: "The team will contact you and provide all the details for your exam.",
  },
  {
    num: 5,
    title: "Attend the Exam",
    desc: "Attend your board exam with special care and full assistance from our team.",
  },
  {
    num: 6,
    title: "Pay & Collect DMC",
    desc: "Pay the remaining fees and collect your Document Mark Certificate.",
  },
];

export default function HowItWorks() {
  return (
    <section id="steps" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            How It Works
          </h2>
          <p className="mt-3 text-gray-400 text-lg">
            6 simple steps to get your board exam done
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex flex-col gap-3 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
                {step.num}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href="/contact"
            className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  );
}

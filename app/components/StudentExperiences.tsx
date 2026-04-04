const reviews = [
  {
    name: "Rahul S.",
    board: "CBSE",
    text: "Amazing service! Got my exam scheduled within 2 days. The team was incredibly supportive throughout.",
  },
  {
    name: "Priya M.",
    board: "ICSE",
    text: "Very professional and trustworthy. They handled all the paperwork and I could focus on studying.",
  },
  {
    name: "Amit K.",
    board: "UP Board",
    text: "I was really stressed but this team made everything smooth. Highly recommended to everyone.",
  },
  {
    name: "Sneha T.",
    board: "Maharashtra Board",
    text: "Quick response and excellent assistance during the exam. Got my DMC within a week. Thank you!",
  },
];

export default function StudentExperiences() {
  return (
    <section
      id="reviews"
      className="py-24 bg-linear-to-br from-indigo-50 via-blue-50 to-white"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Student Experiences
          </h2>
          <p className="mt-3 text-gray-400 text-lg">
            Real stories from students we have helped
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-lg shrink-0">
                  {review.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{review.name}</div>
                  <div className="text-xs text-gray-400">{review.board}</div>
                </div>
                <div className="ml-auto text-yellow-400 text-sm tracking-wide">
                  ★★★★★
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

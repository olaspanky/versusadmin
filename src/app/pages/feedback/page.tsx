"use client";
import { useEffect, useState } from "react";

interface Feedback {
  _id: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const FeedbackDisplay = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async (retries = 3) => {
    setLoading(true);
    setError(null);

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch("https://vbackk.vercel.app/api/feedback", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format");

        setFeedback(data);
        setLoading(false);
        return;

      } catch (err) {
        console.error(`Attempt ${i + 1} failed:`, err);

        if (i === retries - 1) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Calculate average rating
  const averageRating =
    feedback.length > 0
      ? (
          feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length
        ).toFixed(1)
      : 0;

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div className="mx-auto p-6 text-center text-red-500 bg-red-50 rounded-xl max-w-md my-10">
        <p className="text-lg font-semibold">Error: {error}</p>
        <p className="text-sm mt-2">Please check the server or try again later.</p>
      </div>
    );

  return (
    <div className="mx-auto p-6  min-h-screen">
      {/* Header with Average Rating */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          User Feedback
        </h2>
        {feedback.length > 0 && (
          <div className="flex justify-center items-center gap-2">
            <span className="text-2xl font-semibold text-indigo-600">
              {averageRating} / 5
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < Math.round(Number(averageRating))
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500">({feedback.length} reviews)</p>
          </div>
        )}
      </div>

      {/* Feedback Grid */}
      {feedback.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No feedback available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedback.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-800 truncate bg-gray-100 px-2 py-1 rounded-full">
                  {item.email.replace(/"/g, '')}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-yellow-500">★</span>
                  <span className="text-sm font-medium text-gray-700">
                    {item.rating}/5
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {item.comment}
              </p>
              <div className="text-right text-xs text-gray-400 mt-4">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;
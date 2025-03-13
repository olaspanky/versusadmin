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
    setLoading(true); // Ensure loading starts fresh
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
        setLoading(false); // Critical fix: Update loading state on success
        return; // Exit after successful fetch
  
      } catch (err) {
        console.error(`Attempt ${i+1} failed:`, err);
        
        if (i === retries - 1) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false); // Ensure loading stops after final retry
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div className="mx-auto p-6 text-center text-red-500">
        <p>Error: {error}</p>
        <p>Please check the server or try again later.</p>
      </div>
    );

  return (
    <div className="mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-white mb-8">User Feedback</h2>
      {feedback.length === 0 ? (
        <p className="text-center text-gray-500">No feedback available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedback.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-700 font-semibold truncate">{item.email}</span>
                <span className="text-sm font-bold text-yellow-500">⭐ {item.rating}/5</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{item.comment}</p>
              <div className="text-right text-xs text-gray-400 mt-3">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;
import { useEffect, useState } from "react";
import { fetchRecentReviews } from "../../services/reviewService";
import ReviewCard from "./ReviewCard";
import { Link } from "react-router-dom";

function ReviewScroller() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchRecentReviews(0, 5).then((data) => {
      setReviews(data.content || []);
    });
  }, []);

  return (
    <div className="bg-blue-50 py-12">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
        Recent Reviews
      </h2>

      <div className="flex gap-4 overflow-x-auto px-6 scrollbar-hide">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      <div className="text-center mt-6">
        <Link
          to="/add-review"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Write a Review
        </Link>
      </div>
    </div>
  );
}

export default ReviewScroller;

import { Trash2 } from "lucide-react";

function AdminReviewCard({ review, onDelete }) {
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="relative bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">
      {/* DELETE BUTTON */}
      <button
        onClick={() => onDelete(review.id)}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
        title="Delete review"
      >
        <Trash2 size={18} />
      </button>

      {/* RATING */}
      <div className="text-yellow-500 text-lg mb-2">
        {"★".repeat(Math.floor(review.rating))}
        {"☆".repeat(5 - Math.floor(review.rating))}
      </div>

      {/* COMMENT */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        “{review.comment}”
      </p>

      {/* FOOTER */}
      <div className="text-sm text-gray-500">
        <span className="font-medium text-gray-800">
          {review.userName}
        </span>
        {" • "}
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}

export default AdminReviewCard;

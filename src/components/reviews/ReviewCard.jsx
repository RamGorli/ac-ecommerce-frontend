function ReviewCard({ review }) {
  return (
    <div className="min-w-[280px] bg-white rounded-xl shadow-md p-4">
      <h4 className="font-semibold text-blue-800">{review.userName}</h4>

      <div className="text-yellow-500 my-1">
        {"★".repeat(Math.floor(review.rating))}
        {"☆".repeat(5 - Math.floor(review.rating))}
      </div>

      <p className="text-sm text-gray-600 mt-2">
        “{review.comment}”
      </p>
    </div>
  );
}

export default ReviewCard;

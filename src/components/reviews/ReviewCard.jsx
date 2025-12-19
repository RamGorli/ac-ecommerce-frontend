// function ReviewCard({ review }) {
//   return (
//     <div className="min-w-[280px] bg-white rounded-xl shadow-md p-4">
//       <h4 className="font-semibold text-blue-800">{review.userName}</h4>

//       <div className="text-yellow-500 my-1">
//         {"★".repeat(Math.floor(review.rating))}
//         {"☆".repeat(5 - Math.floor(review.rating))}
//       </div>

//       <p className="text-sm text-gray-600 mt-2">
//         “{review.comment}”
//       </p>
//     </div>
//   );
// }

// export default ReviewCard;


function ReviewCard({ review }) {
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">
    
      <div className="text-yellow-500 text-lg mb-2">
        {"★".repeat(Math.floor(review.rating))}
        {"☆".repeat(5 - Math.floor(review.rating))}
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        “{review.comment}”
      </p>

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

export default ReviewCard;

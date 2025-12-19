
// import { useEffect, useState } from "react";
// import { fetchRecentReviews } from "../../services/reviewService";
// import ReviewCard from "./ReviewCard";
// import { Link } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// function ReviewScroller() {
//   const [reviews, setReviews] = useState([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     console.log("Fetching reviews for page:", page);

//     fetchRecentReviews(page, 3)
//       .then((data) => {
//         console.log("API response:", data);
//         setReviews(data.content || []);
//         setTotalPages(data.page?.totalPages ?? 1);
//       })
//       .catch((err) => console.error("Error fetching reviews:", err));
//   }, [page]);

//   const handlePrev = () => {
//     setPage((p) => Math.max(p - 1, 0));
//   };

//   const handleNext = () => {
//     setPage((p) => Math.min(p + 1, totalPages - 1));
//   };

//   return (
//     <div className="bg-blue-50 py-14">
//       <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
//         Recent Reviews
//       </h2>

//       <div className="relative max-w-6xl mx-auto px-10">
//         {/* LEFT */}
//         <button
//           onClick={handlePrev}
//           disabled={page === 0}
//           className={`absolute left-0 top-1/2 -translate-y-1/2 
//             bg-white shadow-md rounded-full p-2
//             ${page === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-blue-100"}`}
//         >
//           <ChevronLeft className="w-6 h-6 text-blue-700" />
//         </button>

//         {/* GRID */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {reviews.length === 0 && (
//             <p className="text-center text-gray-500 col-span-full">
//               No reviews yet. Be the first to write one!
//             </p>
//           )}

//           {reviews.map((r) => (
//             <ReviewCard key={r.id} review={r} />
//           ))}
//         </div>

//         {/* RIGHT */}
//         <button
//           onClick={handleNext}
//           disabled={page >= totalPages - 1}
//           className={`absolute right-0 top-1/2 -translate-y-1/2 
//             bg-white shadow-md rounded-full p-2
//             ${
//               page >= totalPages - 1
//                 ? "opacity-30 cursor-not-allowed"
//                 : "hover:bg-blue-100"
//             }`}
//         >
//           <ChevronRight className="w-6 h-6 text-blue-700" />
//         </button>
//       </div>

//       <div className="text-center mt-8">
//         <Link
//           to="/add-review"
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//         >
//           Write a Review
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default ReviewScroller;

import { useEffect, useState } from "react";
import { fetchRecentReviews } from "../../services/reviewService";
import ReviewCard from "./ReviewCard";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ReviewScroller() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRecentReviews(page, 3)
      .then((data) => {
        setReviews(data.content || []);
        setTotalPages(data.page?.totalPages ?? 1);
      })
      .catch(console.error);
  }, [page]);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));
  const handleNext = () =>
    setPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <div className="bg-blue-50 py-14">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
        Recent Reviews
      </h2>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8">
        {/* LEFT ARROW */}
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 
            bg-white shadow-md rounded-full p-2 z-10
            ${
              page === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-blue-100"
            }`}
        >
          <ChevronLeft className="w-6 h-6 text-blue-700" />
        </button>

        {/* GRID — mobile + tablet = single column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {reviews.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No reviews yet. Be the first to write one!
            </p>
          )}

          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 
            bg-white shadow-md rounded-full p-2 z-10
            ${
              page >= totalPages - 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-blue-100"
            }`}
        >
          <ChevronRight className="w-6 h-6 text-blue-700" />
        </button>
      </div>

      <div className="text-center mt-8">
        <Link
          to="/reviews"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          View all reviews
        </Link>
      </div>
    </div>
  );
}

export default ReviewScroller;

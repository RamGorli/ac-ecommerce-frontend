// import { useEffect, useState } from "react";
// import { fetchRecentReviews } from "../../services/reviewService";
// import ReviewCard from "./ReviewCard";
// import { Link } from "react-router-dom";

// function ReviewScroller() {
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     fetchRecentReviews(0, 3).then((data) => {
//       setReviews(data.content || []);
//     });
//   }, []);

//   return (
//     <div className="bg-blue-50 py-12">
//       <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
//         Recent Reviews
//       </h2>

//       <div className="flex gap-4 overflow-x-auto px-6 scrollbar-hide">
//         {reviews.map((r) => (
//           <ReviewCard key={r.id} review={r} />
//         ))}
//       </div>

//       <div className="text-center mt-6">
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


// import { useEffect, useState } from "react";
// import { fetchRecentReviews } from "../../services/reviewService";
// import ReviewCard from "./ReviewCard";
// import { Link } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// function ReviewScroller() {
//   const [reviews, setReviews] = useState([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   useEffect(() => {
//     fetchRecentReviews(page, 3).then((data) => {
//       setReviews(data.content || []);
//       setTotalPages(data.totalPages);
//     });
//   }, [page]);

//   return (
//     <div className="bg-blue-50 py-14">
//       <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
//         Recent Reviews
//       </h2>

//       <div className="relative max-w-6xl mx-auto px-10">
//         {/* LEFT ARROW */}
//         <button
//           onClick={() => setPage((p) => Math.max(p - 1, 0))}
//           disabled={page === 0}
//           className={`absolute left-0 top-1/2 -translate-y-1/2 
//             bg-white shadow-md rounded-full p-2
//             ${page === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-blue-100"}`}
//         >
//           <ChevronLeft className="w-6 h-6 text-blue-700" />
//         </button>

//         {/* REVIEWS */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-all duration-500">
//           {reviews.map((r) => (
//             <ReviewCard key={r.id} review={r} />
//           ))}
//         </div>

//         {/* RIGHT ARROW */}
//         <button
//           onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
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
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    
    console.log("Fetching reviews for page:", page);
    if (Number.isNaN(page)) return;
    fetchRecentReviews(page, 3)
      .then((data) => {
        console.log("API response:", data);
        setReviews(data.content || []);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [page]);

  return (
    <div className="bg-blue-50 py-14">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
        Recent Reviews
      </h2>

      <div className="relative max-w-6xl mx-auto px-10">
        {/* LEFT ARROW */}
        <button
          onClick={() => {
            console.log("Left arrow clicked. Current page:", page);
            setPage((p) => p - 1);
          }}
          disabled={page === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 
            bg-white shadow-md rounded-full p-2
            ${page === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-blue-100"}`}
        >
          <ChevronLeft className="w-6 h-6 text-blue-700" />
        </button>

        {/* REVIEWS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-all duration-500">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => {
            console.log("Right arrow clicked. Current page:", page);
            setPage((p) => p + 1);
          }}
          disabled={page >= totalPages - 1}
          className={`absolute right-0 top-1/2 -translate-y-1/2 
            bg-white shadow-md rounded-full p-2
            ${page >= totalPages - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-blue-100"
            }`}
        >
          <ChevronRight className="w-6 h-6 text-blue-700" />
        </button>
      </div>

      <div className="text-center mt-8">
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

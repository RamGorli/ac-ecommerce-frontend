// import { useEffect, useState } from "react";
// import {
//   fetchRecentReviews,
//   deleteReview,
// } from "../../services/reviewService";
// import AdminReviewCard from "../../components/admin/AdminReviewCard";

// function ReviewManagement() {
//   const [reviews, setReviews] = useState([]);
//   const [page, setPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const PAGE_SIZE = 9;

//   const loadReviews = async () => {
//     if (loading || !hasMore) return;

//     setLoading(true);
//     try {
//       const data = await fetchRecentReviews(page, PAGE_SIZE);

//       setReviews((prev) => [...prev, ...(data.content || [])]);

//       setHasMore(!data.last);
//       setPage((p) => p + 1);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadReviews();
//   }, []);

//   const handleDelete = async (id) => {
//     const ok = window.confirm("Are you sure you want to delete this review?");
//     if (!ok) return;

//     await deleteReview(id);

//     setReviews((prev) => prev.filter((r) => r.id !== id));
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Review Management</h1>

//       {/* GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {reviews.map((review) => (
//           <AdminReviewCard
//             key={review.id}
//             review={review}
//             onDelete={handleDelete}
//           />
//         ))}
//       </div>

//       {/* EMPTY STATE */}
//       {reviews.length === 0 && !loading && (
//         <p className="text-gray-500 mt-6">No reviews found.</p>
//       )}

//       {/* LOAD MORE */}
//       {hasMore && (
//         <div className="text-center mt-8">
//           <button
//             onClick={loadReviews}
//             disabled={loading}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? "Loading..." : "Load More"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ReviewManagement;


import { useEffect, useState } from "react";
import {
  fetchRecentReviews,
  deleteReview,
} from "../../services/reviewService";
import AdminReviewCard from "../../components/admin/AdminReviewCard";

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 9;

  const loadReviews = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await fetchRecentReviews(page, PAGE_SIZE);

      setReviews((prev) => [...prev, ...(data.content || [])]);

      setHasMore(!data.last);   // ✅ auto-hide Load More when last page
      setPage((p) => p + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this review?");
    if (!ok) return;

    await deleteReview(id);

    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      {/* ✅ CENTERED HEADING */}
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-900">
        Review Management
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <AdminReviewCard
            key={review.id}
            review={review}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* EMPTY STATE */}
      {reviews.length === 0 && !loading && (
        <p className="text-gray-500 mt-10 text-center">
          No reviews found.
        </p>
      )}

      {/* LOADING INDICATOR */}
      {loading && (
        <p className="text-center mt-8 text-gray-600">
          Loading reviews...
        </p>
      )}

      {/* ✅ LOAD MORE — bottom + auto-hidden */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadReviews}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewManagement;

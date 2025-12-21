// import { useState } from "react";
// import { addReview } from "../services/reviewService";
// import { useNavigate } from "react-router-dom";

// function AddReview() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     userName: "",
//     rating: 5,
//     comment: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await addReview(form);
//     alert("Thanks for your review!");
//     navigate("/");
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow">
//       <h2 className="text-2xl font-bold mb-4 text-blue-800">
//         Write a Review
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           placeholder="Your Name"
//           className="w-full border p-2 rounded"
//           onChange={(e) =>
//             setForm({ ...form, userName: e.target.value })
//           }
//         />

//         <select
//           className="w-full border p-2 rounded"
//           onChange={(e) =>
//             setForm({ ...form, rating: e.target.value })
//           }
//         >
//           {[5, 4, 3, 2, 1].map((r) => (
//             <option key={r} value={r}>{r} Stars</option>
//           ))}
//         </select>

//         <textarea
//           placeholder="Your experience..."
//           className="w-full border p-2 rounded"
//           rows="4"
//           onChange={(e) =>
//             setForm({ ...form, comment: e.target.value })
//           }
//         />

//         <button className="w-full bg-blue-600 text-white py-2 rounded">
//           Submit Review
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AddReview;


import { useState } from "react";
import { addReview } from "../services/reviewService";
import { useNavigate } from "react-router-dom";

function AddReview() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: "",
    rating: 5,
    comment: "",
  });

  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addReview(form);
    alert("Thanks for your review!");
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        Write a Review
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Your Name"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, userName: e.target.value })
          }
        />

        {/* Star Rating */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setForm({ ...form, rating: star })}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`text-2xl ${
                star <= (hoverRating || form.rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-gray-700">{form.rating} Stars</span>
        </div>

        <textarea
          placeholder="Your experience..."
          className="w-full border p-2 rounded"
          rows="4"
          onChange={(e) =>
            setForm({ ...form, comment: e.target.value })
          }
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Submit Review
        </button>
      </form>
    </div>
  );
}

export default AddReview;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { addToCart } from "../services/cartApi";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/find-by-id/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch product:", err);
      alert("❌ Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const res = await addToCart(localStorage.getItem("email"), product.id);
      alert(res.message || `${product.name} added to cart 🛒`);
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("❌ Failed to add to cart.");
    }
  };

  const handleOrderNow = () => {
    const email = localStorage.getItem("email");
    if (!email) return alert("Please log in to continue.");
    navigate("/checkout", { state: { productId: product.id } });
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-lg text-gray-700">
        Loading product details...
      </p>
    );

  if (!product)
    return (
      <p className="text-center mt-10 text-lg text-gray-600">
        Product not found.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-8">
        {/* ✅ Product Image */}
        <div className="flex-1 flex justify-center items-center">
          {product.image ? (
            <img
              src={`data:image/jpeg;base64,${product.image}`}
              alt={product.name}
              className="w-full max-w-sm h-auto rounded-2xl object-cover shadow-md"
            />
          ) : (
            <div className="w-full max-w-sm h-64 bg-gray-200 rounded-2xl flex justify-center items-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* ✅ Product Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 text-lg">
            <span className="font-semibold">Type:</span> {product.type}
          </p>
          <p className="text-gray-700 text-base leading-relaxed">
            {product.description || "No description available."}
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-4">₹{product.price}</p>

          {/* ✅ Action buttons */}
          <div className="flex gap-4 mt-6 flex-col sm:flex-row">
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleOrderNow}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;












// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../services/api";
// import { addToCart } from "../services/cartApi";
// import { placeOrder } from "../services/orderApi";

// function ProductDetails() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [address, setAddress] = useState("");
//   const [pinCode, setPinCode] = useState("");

//   const fetchProduct = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/products/find-by-id/${id}`);
//       setProduct(res.data);
//     } catch (err) {
//       console.error("❌ Failed to fetch product:", err);
//       alert("❌ Failed to load product details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, [id]);

//   const handleAddToCart = async () => {
//     try {
//       const res = await addToCart(localStorage.getItem("email"), product.id);
//       alert(res.message || `${product.name} added to cart 🛒`);
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       alert("❌ Failed to add to cart.");
//     }
//   };

// const handleOrderNow = async () => {
//   const email = localStorage.getItem("email");
//   if (!email) return alert("Please log in to place an order.");

//   if (!address || !pinCode) return alert("Please enter delivery address and pin code.");

//   const orderData = {
//     productId: product.id,
//     userEmail: email,
//     orderStatus: "PLACED",
//     address,
//     pinCode: parseInt(pinCode),
//   };

//   try {
//     const res = await placeOrder(orderData);
//     alert(res.message || `✅ ${product.name} ordered successfully!`);
//     setAddress("");
//     setPinCode("");
//   } catch (err) {
//     console.error("❌ Error placing order:", err);
//     alert("❌ Failed to place order. Please try again later.");
//   }
// };

//   if (loading)
//     return (
//       <p className="text-center mt-10 text-lg text-gray-700">
//         Loading product details...
//       </p>
//     );

//   if (!product)
//     return (
//       <p className="text-center mt-10 text-lg text-gray-600">
//         Product not found.
//       </p>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 py-10">
//       <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-8">
//         {/* ✅ Product Image */}
//         <div className="flex-1 flex justify-center items-center">
//           {product.image ? (
//             <img
//               src={`data:image/jpeg;base64,${product.image}`}
//               alt={product.name}
//               className="w-full max-w-sm h-auto rounded-2xl object-cover shadow-md"
//             />
//           ) : (
//             <div className="w-full max-w-sm h-64 bg-gray-200 rounded-2xl flex justify-center items-center text-gray-500">
//               No Image
//             </div>
//           )}
//         </div>

//         {/* ✅ Product Info */}
//         <div className="flex-1 space-y-4">
//           <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
//           <p className="text-gray-600 text-lg">
//             <span className="font-semibold">Type:</span> {product.type}
//           </p>
//           <p className="text-gray-700 text-base leading-relaxed">
//             {product.description || "No description available."}
//           </p>
//           <p className="text-2xl font-bold text-blue-600 mt-4">₹{product.price}</p>

//           {/* ✅ Address & Pin inputs */}
//           <div className="space-y-3 mt-6">
//             <input
//               type="text"
//               placeholder="Enter delivery address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
//             />
//             <input
//               type="number"
//               placeholder="Enter pin code"
//               value={pinCode}
//               onChange={(e) => setPinCode(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
//             />
//           </div>

//           <div className="flex gap-4 mt-6 flex-col sm:flex-row">
//             <button
//               onClick={handleAddToCart}
//               className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
//             >
//               Add to Cart
//             </button>
//             <button
//               onClick={handleOrderNow}
//               className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
//             >
//               Order Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductDetails;

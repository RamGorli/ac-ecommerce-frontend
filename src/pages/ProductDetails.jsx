// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { addToCart } from "../services/cartApi";
// import { fetchAllProducts } from "../services/productApi";

// function ProductDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       setLoading(true);
//       try {
//         // Fetch main product
//         const res = await api.get(`/products/find-by-id/${id}`);
//         const prod = res.data;
//         setProduct(prod);

//         // Fetch all products to find related
//         const all = await fetchAllProducts(0, 1000);
//         const converted = all; // No conversion needed

//         // Related products: same type, exclude main product
//         let related = converted.filter((p) => p.type === prod.type && p.id !== prod.id);

//         // If less than 4, add random other products
//         if (related.length < 4) {
//           const needed = 4 - related.length;
//           const others = converted
//             .filter((p) => p.id !== prod.id && !related.some((r) => r.id === p.id))
//             .sort(() => 0.5 - Math.random())
//             .slice(0, needed);
//           related = [...related, ...others];
//         }

//         setRelatedProducts(related.slice(0, 4));
//       } catch (err) {
//         console.error("Failed to fetch product:", err);
//         alert("Failed to load product details.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   const handleAddToCart = async () => {
//     try {
//       const res = await addToCart(localStorage.getItem("email"), product.id);
//       let qtyStore = JSON.parse(localStorage.getItem("cartQuantities") || "{}");
//       qtyStore[product.id] = (qtyStore[product.id] || 0) + quantity;
//       localStorage.setItem("cartQuantities", JSON.stringify(qtyStore));
//       alert(res.message || `${product.name} added to cart 🛒`);
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       alert("Failed to add to cart.");
//     }
//   };

//   const handleOrderNow = () => {
//     const email = localStorage.getItem("email");
//     if (!email) return alert("Please log in to continue.");
//     navigate("/checkout", { state: { productId: product.id, quantity } });
//   };

//   if (loading)
//     return <p className="text-center mt-10 text-gray-700">Loading product details...</p>;
//   if (!product)
//     return <p className="text-center mt-10 text-gray-600">Product not found.</p>;

//   return (
//     <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
//       {/* Main Product */}
//       <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center hover:shadow-xl transition">
//         <div className="flex-1 flex justify-center items-center">
//           {product.imageUrl ? (
//             <img
//               src={product.imageUrl}
//               alt={product.name}
//               className="w-full max-w-sm h-[380px] object-cover rounded-2xl shadow-md"
//             />
//           ) : (
//             <div className="w-full max-w-sm h-[380px] bg-gray-200 rounded-2xl flex justify-center items-center text-gray-500">
//               No Image
//             </div>
//           )}
//         </div>

//         <div className="flex-1 flex flex-col justify-between space-y-5">
//           <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
//           <p className="text-gray-700 text-lg">
//             <span className="font-semibold">Brand:</span> {product.brand || "Unknown"}
//           </p>
//           <p className="text-gray-700 text-lg">
//             <span className="font-semibold">Type:</span> {product.type}
//           </p>
//           <p className="text-gray-700 text-lg">
//             <span className="font-semibold">Capacity:</span> {product.capacity || "N/A"}
//           </p>
//           <p className="text-gray-700 text-lg leading-relaxed">
//             {product.description || "No description available."}
//           </p>
//           <p className="text-3xl font-bold text-blue-600 mt-4">AUD ${product.price}</p>

//           <div className="flex items-center gap-4 mt-4">
//             <button
//               onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//               className="w-10 h-10 flex items-center justify-center bg-gray-200 text-xl font-bold rounded-lg hover:bg-gray-300"
//             >
//               -
//             </button>
//             <span className="text-2xl font-semibold">{quantity}</span>
//             <button
//               onClick={() => setQuantity((q) => q + 1)}
//               className="w-10 h-10 flex items-center justify-center bg-gray-200 text-xl font-bold rounded-lg hover:bg-gray-300"
//             >
//               +
//             </button>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 mt-6">
//             <button
//               onClick={handleAddToCart}
//               className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 active:bg-green-700 transition text-lg"
//             >
//               Add to Cart
//             </button>
//             <button
//               onClick={handleOrderNow}
//               className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition text-lg"
//             >
//               Order Now
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       {relatedProducts.length > 0 && (
//         <div className="max-w-6xl mx-auto mt-16">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">You may also like</h2>
//           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//             {relatedProducts.map((p) => (
//               <div
//                 key={p.id}
//                 onClick={() => navigate(`/products/${p.id}`)}
//                 className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
//               >
//                 {p.imageUrl ? (
//                   <img
//                     src={p.imageUrl}
//                     alt={p.name}
//                     className="w-full h-48 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
//                   />
//                 ) : (
//                   <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
//                     No Image
//                   </div>
//                 )}
//                 <h4 className="font-bold mt-2 text-gray-900 group-hover:underline">
//                   {p.brand || "Unknown Brand"}
//                 </h4>
//                 <h3 className="font-semibold text-gray-800 group-hover:underline">{p.name}</h3>
//                 <p className="text-gray-700 text-sm group-hover:underline">
//                   {p.type} • {p.capacity || "N/A"}
//                 </p>
//                 <p className="text-blue-700 font-semibold mt-1 group-hover:underline">
//                   AUD ${p.price}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProductDetails;




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { addToCart } from "../services/cartApi";
import {
  fetchProductsByType,
  fetchProductsLessThan,
  fetchProductsGreaterThan
} from "../services/productApi";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        // Fetch main product
        const res = await api.get(`/products/find-by-id/${id}`);
        const prod = res.data;
        setProduct(prod);

        // Fetch same-type products
        let sameType = await fetchProductsByType(prod.type, 0, 10);
        sameType = sameType.filter((p) => p.id !== prod.id);

        let related = [...sameType];

        // If less than 4, fetch by price similarity
        if (related.length < 4) {
          const price = parseFloat(prod.price);

          const cheaper = await fetchProductsLessThan(price + 200, 0, 10);
          const costly = await fetchProductsGreaterThan(price - 200, 0, 10);

          const combined = [...cheaper, ...costly];

          // Remove duplicates + current product + already added
          const unique = combined.filter(
            (p, idx) =>
              p.id !== prod.id &&
              !related.some((r) => r.id === p.id) &&
              combined.findIndex((x) => x.id === p.id) === idx
          );

          related.push(...unique);
        }

        // Only show top 4
        setRelatedProducts(related.slice(0, 4));
      } catch (err) {
        console.error("Failed to load product:", err);
        alert("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(localStorage.getItem("email"), product.id);

      let qtyStore = JSON.parse(localStorage.getItem("cartQuantities") || "{}");
      qtyStore[product.id] = (qtyStore[product.id] || 0) + quantity;
      localStorage.setItem("cartQuantities", JSON.stringify(qtyStore));

      // Redirect to cart page
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add to cart.");
    }
  };

  const handleOrderNow = () => {
    const email = localStorage.getItem("email");
    if (!email) return alert("Please log in to continue.");
    navigate("/checkout", { state: { productId: product.id, quantity } });
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-700">Loading product...</p>;

  if (!product)
    return <p className="text-center mt-10 text-gray-600">Product not found.</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      {/* MAIN PRODUCT */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center hover:shadow-xl transition">
        <div className="flex-1 flex justify-center items-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full max-w-sm h-[380px] object-cover rounded-2xl shadow-md"
            />
          ) : (
            <div className="w-full max-w-sm h-[380px] bg-gray-200 rounded-2xl flex justify-center items-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-5">
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Brand:</span> {product.brand}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Type:</span> {product.type}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Capacity:</span> {product.capacity}
          </p>

          <p className="text-gray-700 text-lg">{product.description}</p>

          <p className="text-3xl font-bold text-blue-600 mt-4">AUD ${product.price}</p>

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 text-xl rounded-lg hover:bg-gray-300"
            >
              -
            </button>
            <span className="text-2xl font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 text-xl rounded-lg hover:bg-gray-300"
            >
              +
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 text-lg"
            >
              Add to Cart
            </button>
            <button
              onClick={handleOrderNow}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 text-lg"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You may also like</h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
              >
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-48 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <h4 className="font-bold text-gray-900">{p.brand}</h4>
                <h3 className="font-semibold text-gray-800">{p.name}</h3>
                <p className="text-gray-700 text-sm">
                  {p.type} • {p.capacity}
                </p>
                <p className="text-blue-700 font-semibold mt-1">
                  AUD ${p.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;


// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { addToCart } from "../services/cartApi";
// import { fetchFilteredProducts } from "../services/productApi";

// function ProductDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);

//   const email = localStorage.getItem("email");

//   useEffect(() => {
//     const loadProduct = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get(`/products/everyone/find-by-id/${id}`);
//         const prod = res.data;
//         setProduct(prod);
        
//         const price = parseFloat(prod.price);
//         let related = await fetchFilteredProducts({
//           type: prod.type,
//           minPrice: price - 200,
//           maxPrice: price + 200,
//           page: 0,
//           size: 50,
//         });

//         let list = related.content.filter(p => p.id !== prod.id);

//         if (list.length < 4) {
//           const sameType = await fetchFilteredProducts({
//             type: prod.type,
//             page: 0,
//             size: 50,
//           });

//           sameType.content.forEach(p => {
//             if (p.id !== prod.id && !list.some(x => x.id === p.id)) {
//               list.push(p);
//             }
//           });
//         }

//         if (list.length < 4) {
//           const all = await fetchFilteredProducts({ page: 0, size: 50 });

//           all.content.forEach(p => {
//             if (p.id !== prod.id && !list.some(x => x.id === p.id)) {
//               list.push(p);
//             }
//           });
//         }

//         setRelatedProducts(list.slice(0, 4));
//       } catch (err) {
//         console.error("Failed to load product:", err);
//         alert("Failed to load product details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProduct();
//   }, [id]);

//   const handleAddToCart = async () => {
//     if (email) {
//       // Logged-in user → existing backend logic
//       try {
//         await addToCart(email, product.id);

//         const qtyStore = JSON.parse(localStorage.getItem("cartQuantities") || "{}");
//         qtyStore[product.id] = (qtyStore[product.id] || 0) + quantity;
//         localStorage.setItem("cartQuantities", JSON.stringify(qtyStore));

//         alert(`${product.name} added to cart 🛒`);
//         navigate("/cart");
//       } catch (err) {
//         console.error("Add to cart error:", err);
//         alert("Failed to add to cart.");
//       }
//     } else {
//       // Guest user → localStorage cart
//       const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//       const existing = guestCart.find((p) => p.id === product.id);
//       if (existing) {
//         existing.quantity += quantity;
//       } else {
//         guestCart.push({ ...product, quantity });
//       }
//       localStorage.setItem("guestCart", JSON.stringify(guestCart));
//       alert(`${product.name} added to guest cart 🛒`);
//       navigate("/cart");
//     }
//   };

//   const handleOrderNow = () => {
//     if (!email) {
//       navigate("/checkout", { state: { productId: product.id, quantity, guest: true } });
//     } else {
//       navigate("/checkout", { state: { productId: product.id, quantity } });
//     }
//   };

//   if (loading)
//     return <p className="text-center mt-10 text-gray-700">Loading product...</p>;

//   if (!product)
//     return <p className="text-center mt-10 text-gray-600">Product not found.</p>;

//   return (
//     <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
//       {/* MAIN PRODUCT */}
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
//             <span className="font-semibold">Brand:</span> {product.brand}
//           </p>
//           <p className="text-gray-700 text-lg">
//             <span className="font-semibold">Type:</span> {product.type}
//           </p>
//           <p className="text-gray-700 text-lg">
//             <span className="font-semibold">Capacity:</span> {product.capacity}kW
//           </p>
//           <p className="text-gray-700 text-lg">{product.description}</p>
//           <p className="text-3xl font-bold text-blue-600 mt-4">AUD ${product.price}</p>

//           {/* Quantity selector */}
//           <div className="flex items-center gap-4 mt-4">
//             <button
//               onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//               className="w-10 h-10 flex items-center justify-center bg-gray-200 text-xl rounded-lg hover:bg-gray-300"
//             >
//               -
//             </button>
//             <span className="text-2xl font-semibold">{quantity}</span>
//             <button
//               onClick={() => setQuantity((q) => q + 1)}
//               className="w-10 h-10 flex items-center justify-center bg-gray-200 text-xl rounded-lg hover:bg-gray-300"
//             >
//               +
//             </button>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 mt-6">
//             <button
//               onClick={handleAddToCart}
//               className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 text-lg"
//             >
//               Add to Cart
//             </button>
//             <button
//               onClick={handleOrderNow}
//               className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 text-lg"
//             >
//               Order Now
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* RELATED PRODUCTS */}
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
//                     className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
//                   />
//                 ) : (
//                   <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
//                     No Image
//                   </div>
//                 )}

//                 <h4 className="font-bold mt-2 break-words group-hover:underline">
//                   {p.brand || "Unknown Brand"}
//                 </h4>

//                 <h3 className="font-semibold break-words group-hover:underline">
//                   {p.name}
//                 </h3>

//                 <p className="text-sm break-words group-hover:underline">
//                   {p.type} • {p.capacity || "N/A"}kW
//                 </p>

//                 <p className="text-blue-700 font-semibold mt-1 break-words group-hover:underline">
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
import { fetchFilteredProducts } from "../services/productApi";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/everyone/find-by-id/${id}`);
        const prod = res.data;
        setProduct(prod);
        
        const price = parseFloat(prod.price);
        let related = await fetchFilteredProducts({
          type: prod.type,
          minPrice: price - 200,
          maxPrice: price + 200,
          page: 0,
          size: 50,
        });

        let list = related.content.filter(p => p.id !== prod.id);

        if (list.length < 4) {
          const sameType = await fetchFilteredProducts({
            type: prod.type,
            page: 0,
            size: 50,
          });

          sameType.content.forEach(p => {
            if (p.id !== prod.id && !list.some(x => x.id === p.id)) {
              list.push(p);
            }
          });
        }

        if (list.length < 4) {
          const all = await fetchFilteredProducts({ page: 0, size: 50 });

          all.content.forEach(p => {
            if (p.id !== prod.id && !list.some(x => x.id === p.id)) {
              list.push(p);
            }
          });
        }

        setRelatedProducts(list.slice(0, 4));
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
    if (email) {
      // Logged-in user → existing backend logic
      try {
        await addToCart(email, product.id);

        const qtyStore = JSON.parse(localStorage.getItem("cartQuantities") || "{}");
        qtyStore[product.id] = (qtyStore[product.id] || 0) + quantity;
        localStorage.setItem("cartQuantities", JSON.stringify(qtyStore));

        alert(`${product.name} added to cart 🛒`);
        navigate("/cart");
      } catch (err) {
        console.error("Add to cart error:", err);
        alert("Failed to add to cart.");
      }
    } else {
      // Guest user → localStorage cart
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const existing = guestCart.find((p) => p.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        guestCart.push({ ...product, quantity });
      }
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      alert(`${product.name} added to guest cart 🛒`);
      navigate("/cart");
    }
  };

  const handleOrderNow = () => {
    if (!email) {
      navigate("/checkout", { state: { productId: product.id, quantity, guest: true } });
    } else {
      navigate("/checkout", { state: { productId: product.id, quantity } });
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-700">Loading product...</p>;

  if (!product)
    return <p className="text-center mt-10 text-gray-600">Product not found.</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-8">
      {/* MAIN PRODUCT */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-5 sm:p-8 md:p-10 flex flex-col md:flex-row gap-8 md:items-start hover:shadow-xl transition">
        {/* IMAGE */}
        <div className="flex-1 flex justify-center items-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="
                w-full max-w-xs sm:max-w-sm md:max-w-md
                h-48 sm:h-64 md:h-[380px]
                object-contain rounded-2xl shadow-md
              "
            />
          ) : (
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md h-48 sm:h-64 md:h-[380px] bg-gray-200 rounded-2xl flex justify-center items-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 break-words">
            {product.name}
          </h1>

          <div className="space-y-2 text-sm sm:text-base text-gray-700">
            <p>
              <span className="font-semibold">Brand:</span> {product.brand || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Type:</span> {product.type || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Capacity:</span>{" "}
              {product.capacity ? `${product.capacity}kW` : "N/A"}
            </p>
            <p className="text-gray-700 leading-relaxed break-words">
              {product.description}
            </p>
          </div>

          <div className="mt-2">
            <p className="text-2xl sm:text-3xl md:text-3xl font-bold text-blue-600">
              AUD ${product.price}
            </p>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 text-xl rounded-lg hover:bg-gray-300"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="text-lg sm:text-2xl font-semibold min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 text-xl rounded-lg hover:bg-gray-300"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleAddToCart}
              className="w-full sm:flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 text-base sm:text-lg"
            >
              Add to Cart
            </button>
            <button
              onClick={handleOrderNow}
              className="w-full sm:flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 text-base sm:text-lg"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-10 sm:mt-12">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-800 mb-4">
            You may also like
          </h2>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="bg-white shadow-md rounded-lg p-3 hover:shadow-lg transition cursor-pointer group"
              >
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-40 sm:h-44 md:h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-40 sm:h-44 md:h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    No Image
                  </div>
                )}

                <h4 className="font-bold mt-2 text-sm sm:text-base break-words group-hover:underline">
                  {p.brand || "Unknown Brand"}
                </h4>

                <h3 className="font-semibold text-sm sm:text-base break-words group-hover:underline">
                  {p.name}
                </h3>

                <p className="text-xs sm:text-sm break-words group-hover:underline">
                  {p.type} • {p.capacity || "N/A"}kW
                </p>

                <p className="text-blue-700 font-semibold mt-1 text-sm sm:text-base break-words group-hover:underline">
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

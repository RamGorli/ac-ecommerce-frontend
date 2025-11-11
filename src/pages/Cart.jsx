// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getCart, removeFromCart, emptyCart } from "../services/cartApi";
// import api from "../services/api";

// const Cart = () => {
//   const [cart, setCart] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const email = localStorage.getItem("email");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (email) fetchCart();
//   }, [email]);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const { cart } = await getCart(email);
//       setCart(cart);

//       const items = await Promise.all(
//         cart.map((id) => api.get(`/products/find-by-id/${id}`).then((res) => res.data))
//       );
//       setProducts(items);
//     } catch (err) {
//       console.error("Error loading cart:", err);
//       alert("Error loading cart. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemove = async (productId) => {
//     try {
//       await removeFromCart(email, productId);
//       alert("Product removed");
//       fetchCart();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to remove product");
//     }
//   };

//   const handleEmpty = async () => {
//     try {
//       await emptyCart(email);
//       alert("Cart cleared");
//       fetchCart();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to clear cart");
//     }
//   };

//   const handleCheckout = () => {
//     if (!products.length) {
//       alert("Your cart is empty!");
//       return;
//     }
//     navigate("/checkout");
//   };

//   if (loading)
//     return <p className="text-center mt-10 text-lg">Loading cart...</p>;

//   return (
//     <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//         🛒 Your Cart
//       </h1>

//       {!products.length ? (
//         <p className="text-center text-gray-500 mt-10 text-lg">
//           Your cart is empty
//         </p>
//       ) : (
//         <>
//           {/* Product Grid */}
//           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 onClick={() => navigate(`/products/${product.id}`)}
//                 className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
//               >
//                 {product.image ? (
//                   <img
//                     src={`data:image/jpeg;base64,${product.image}`}
//                     alt={product.name}
//                     className="w-full h-48 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
//                   />
//                 ) : (
//                   <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
//                     No Image
//                   </div>
//                 )}

//                 <h4 className="font-semibold group-hover:underline">
//                   {product.name}
//                 </h4>
//                 <p className="text-gray-700">₹{product.price}</p>
//                 <p className="text-gray-600 text-sm group-hover:underline">
//                   {product.type}
//                 </p>
//                 <p className="text-gray-500 text-sm">{product.description}</p>

//                 {/* Remove Button (stop propagation so card click doesn’t trigger navigation) */}
//                 <div className="mt-3" onClick={(e) => e.stopPropagation()}>
//                   <button
//                     onClick={() => handleRemove(product.id)}
//                     className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Cart Actions */}
//           <div className="text-center mt-6 flex flex-col sm:flex-row justify-center gap-4">
//             <button
//               onClick={handleEmpty}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
//             >
//               🗑️ Empty Cart
//             </button>
//             <button
//               onClick={handleCheckout}
//               className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, removeFromCart, emptyCart } from "../services/cartApi";
import api from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (email) fetchCart();
  }, [email]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { cart } = await getCart(email);
      setCart(cart);

      const items = await Promise.all(
        cart.map((id) => api.get(`/products/find-by-id/${id}`).then((res) => res.data))
      );
      setProducts(items);
    } catch (err) {
      console.error("Error loading cart:", err);
      alert("Error loading cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this item from your cart?")) return;

    try {
      await removeFromCart(email, productId);
      alert("Item removed from your cart!");
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to remove product. Please try again.");
    }
  };

  const handleEmpty = async () => {
    if (!window.confirm("Are you sure you want to empty your cart?")) return;

    try {
      await emptyCart(email);
      alert("Cart cleared successfully!");
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to clear cart. Please try again.");
    }
  };

  const handleCheckout = () => {
    if (!products.length) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading cart...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Cart
      </h1>

      {!products.length ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          Your cart is empty
        </p>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
              >
                {product.image ? (
                  <img
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <h4 className="font-semibold group-hover:underline">
                  {product.name}
                </h4>
                <p className="text-gray-700">₹{product.price}</p>
                <p className="text-gray-600 text-sm group-hover:underline">
                  {product.type}
                </p>
                <p className="text-gray-500 text-sm mb-2">{product.description}</p>

                {/* Small text-style remove link */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 text-sm text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-1 w-fit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(product.id);
                  }}
                >
                  <span role="img" aria-label="delete">
                    🗑️
                  </span>
                  <span >Remove</span>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Actions */}
          <div className="text-center mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleEmpty}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Empty Cart
            </button>
            <button
              onClick={handleCheckout}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

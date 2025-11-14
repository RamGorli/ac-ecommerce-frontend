import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getCart, emptyCart } from "../services/cartApi";
import { placeOrder, placeMultipleOrders } from "../services/orderApi";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const singleProductId = location.state?.productId || null;
  const cartItems = location.state?.items || null;

  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [deliveryType, setDeliveryType] = useState("STANDARD");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      alert("Please log in to continue.");
      navigate("/login");
      return;
    }

    if (cartItems) {
      // Coming from Cart → we already have items with quantity
      setProducts(cartItems);
      setLoading(false);
    } else if (singleProductId) {
      // Coming from Product Details
      fetchSingleProduct(singleProductId);
    } else {
      // Safety fallback
      alert("No products to checkout.");
      navigate("/cart");
    }
  }, [email, singleProductId, cartItems]);

  // Fetch a single product for "Order Now"
  const fetchSingleProduct = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/products/find-by-id/${id}`);
      const product = res.data;

      setProducts([
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: location.state?.quantity || 1,
          image: product.image,
          type: product.type,
        },
      ]);
    } catch (err) {
      console.error("Failed loading product:", err);
      alert("Failed to load product.");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  // Place order for single OR multiple
  const handlePlaceOrder = async () => {
    if (!address || !pinCode) {
      alert("Please enter delivery address and pin code.");
      return;
    }

    try {
      const orders = products.map((p) => {
        const deliveryCost = deliveryType === "EXPRESS" ? 40 : 30;

        return {
          productId: p.id,
          userEmail: email,
          productName: p.name,
          productPrice: p.price, // unit price
          quantity: p.quantity,
          totalPrice: p.price * p.quantity + deliveryCost,
          orderStatus: "PLACED",
          deliveryType,
          needInstallment: false,
          address,
          pinCode: parseInt(pinCode),
        };
      });

      if (orders.length === 1) {
        await placeOrder(orders[0]);
      } else {
        await placeMultipleOrders(orders);
      }

      // Only empty cart if the user came from CartPage
      if (cartItems) await emptyCart(email);

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">Loading checkout...</p>
    );

  if (products.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600">
        No products available to checkout.
      </p>
    );

  const deliveryCost = deliveryType === "EXPRESS" ? 40 : 30;
  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const total = subtotal + deliveryCost;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10 flex justify-center">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* ORDER SUMMARY */}
        <div className="p-8 bg-gray-50 border-r border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-3 bg-white rounded-xl shadow">
                {p.image ? (
                  <img
                    src={`data:image/jpeg;base64,${p.image}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{p.price} × {p.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-lg font-semibold flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="mt-2 text-lg font-semibold flex justify-between">
            <span>Delivery</span>
            <span>₹{deliveryCost}</span>
          </div>

          <div className="mt-4 border-t pt-4 text-xl font-bold flex justify-between">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* DELIVERY SECTION */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>

            <input
              type="text"
              placeholder="Enter delivery address"
              className="w-full p-3 border rounded-lg mb-4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input
              type="number"
              placeholder="Enter pin code"
              className="w-full p-3 border rounded-lg mb-8"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />

            {/* DELIVERY TYPE */}
            <h3 className="text-xl font-semibold mb-2">Delivery Type</h3>
            <div className="flex gap-4 mb-8">
              <button
                className={`px-4 py-2 rounded-lg border ${
                  deliveryType === "STANDARD" ? "bg-blue-100 border-blue-400" : ""
                }`}
                onClick={() => setDeliveryType("STANDARD")}
              >
                Standard (₹30)
              </button>

              <button
                className={`px-4 py-2 rounded-lg border ${
                  deliveryType === "EXPRESS" ? "bg-blue-100 border-blue-400" : ""
                }`}
                onClick={() => setDeliveryType("EXPRESS")}
              >
                Express (₹40)
              </button>
            </div>

            {/* PAYMENT INFO */}
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <p className="text-sm text-gray-500 mb-3">
              All transactions are secure and encrypted.
            </p>

            <div className="border rounded-lg p-4">
              <p>
                <span className="font-semibold">Account Name:</span> AirXSolar Pty Ltd
              </p>
              <p>
                <span className="font-semibold">BSB:</span> 123 123
              </p>
              <p>
                <span className="font-semibold">Account Number:</span> 2152 2551
              </p>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-lg mt-10"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;



// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { getCart, emptyCart } from "../services/cartApi";
// import { placeOrder, placeMultipleOrders } from "../services/orderApi";

// const CheckoutPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = localStorage.getItem("email");

//   const [products, setProducts] = useState([]);
//   const [address, setAddress] = useState("");
//   const [pinCode, setPinCode] = useState("");
//   const [loading, setLoading] = useState(true);

//   const productId = location.state?.productId;

//   useEffect(() => {
//     if (!email) {
//       alert("Please log in to continue.");
//       navigate("/login");
//       return;
//     }

//     productId ? fetchSingleProduct(productId) : fetchCartProducts();
//   }, [email, productId]);

//   const fetchSingleProduct = async (id) => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/products/find-by-id/${id}`);
//       setProducts([res.data]);
//     } catch (err) {
//       console.error("Product fetch failed:", err);
//       alert("Failed to load product details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCartProducts = async () => {
//     try {
//       const { cart } = await getCart(email);
//       const productData = await Promise.all(
//         cart.map((id) =>
//           api.get(`/products/find-by-id/${id}`).then((res) => res.data)
//         )
//       );
//       setProducts(productData);
//     } catch (err) {
//       console.error("Cart fetch failed:", err);
//       alert("Failed to load cart products.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePlaceOrder = async () => {
//     if (!address || !pinCode) {
//       alert("Please enter delivery address and pin code.");
//       return;
//     }

//     try {
//       if (products.length === 0) {
//         alert("No products found to order.");
//         return;
//       }

//       if (products.length > 1) {
//         const orders = products.map((p) => ({
//           productId: p.id,
//           userEmail: email,
//           orderStatus: "PLACED",
//           address,
//           pinCode: parseInt(pinCode),
//           productName: p.name,
//           totalPrice: p.price,
//         }));

//         console.log("Multiple orders:", orders);
//         await placeMultipleOrders(orders);
//       } else {
//         const p = products[0];
//         const order = {
//           productId: p.id,
//           userEmail: email,
//           orderStatus: "PLACED",
//           address,
//           pinCode: parseInt(pinCode),
//           productName: p.name,
//           totalPrice: p.price,
//         };

//         console.log("Single order:", order);
//         await placeOrder(order);
//       }

//       if (!productId) await emptyCart(email);

//       alert("Order placed successfully! Check your email for confirmation.");
//       navigate("/orders");
//     } catch (err) {
//       console.error("Order placement failed:", err);
//       alert("Failed to place order. Please try again later.");
//     }
//   };

//   if (loading)
//     return (
//       <p className="text-center mt-10 text-gray-700">Loading checkout...</p>
//     );

//   if (products.length === 0)
//     return (
//       <p className="text-center mt-10 text-gray-500">
//         No products to checkout.
//       </p>
//     );

//   const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 py-10 flex justify-center">
//       <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
//         {/* Left Section: Order Summary */}
//         <div className="p-8 lg:p-10 bg-gray-50 border-r border-gray-100">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

//           <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
//             {products.map((p) => (
//               <div
//                 key={p.id}
//                 className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition"
//               >
//                 {p.image ? (
//                   <img
//                     src={`data:image/jpeg;base64,${p.image}`}
//                     alt={p.name}
//                     className="w-20 h-20 rounded-lg object-cover"
//                   />
//                 ) : (
//                   <div className="w-20 h-20 bg-gray-200 rounded-lg flex justify-center items-center text-gray-500">
//                     No Image
//                   </div>
//                 )}
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-gray-800">{p.name}</h3>
//                   <p className="text-gray-600 text-sm">₹{p.price}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between text-lg font-semibold text-gray-800">
//             <span>Total:</span>
//             <span>₹{totalPrice}</span>
//           </div>
//         </div>

//         {/* Right Section: Delivery + Payment */}
//         <div className="p-8 lg:p-10 flex flex-col justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">
//               Delivery Details
//             </h2>

//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Enter delivery address"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
//               />
//               <input
//                 type="number"
//                 placeholder="Enter pin code"
//                 value={pinCode}
//                 onChange={(e) => setPinCode(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
//               />
//             </div>

//             <div className="mt-8">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment</h2>
//               <p className="text-sm text-gray-500 mb-3">
//                 All transactions are secure and encrypted.
//               </p>

//               <div className="border border-gray-200 rounded-lg overflow-hidden">
//                 <div className="bg-blue-50 p-3 border-b border-gray-200 font-medium text-gray-800">
//                   Bank Deposit
//                 </div>

//                 <div className="p-4 text-gray-700 space-y-2">
//                   <p>
//                     <span className="font-semibold">Account Name:</span> AirXSolar Pty Ltd
//                   </p>
//                   <p>
//                     <span className="font-semibold">BSB:</span> 123 123
//                   </p>
//                   <p>
//                     <span className="font-semibold">Account Number:</span> 2152 2551
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-10 text-center">
//             <button
//               onClick={handlePlaceOrder}
//               className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition text-lg"
//             >
//               Place Order
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;


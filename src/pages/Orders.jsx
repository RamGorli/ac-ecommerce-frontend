import { useEffect, useState } from "react";
import { fetchUserOrders, deleteOrder } from "../services/orderApi";
import api from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (email) fetchOrders();
  }, [email]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchUserOrders(email);

      const detailedOrders = await Promise.all(
        data.map(async (order) => {
          const res = await api.get(`/products/find-by-id/${order.productId}`);
          return { ...order, product: res.data };
        })
      );

      setOrders(detailedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Unable to load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await deleteOrder(id);
      alert(res.message || "Order cancelled successfully!");
      fetchOrders();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Could not cancel order. Please try again later.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading your orders...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🛍️ Your Orders</h1>

      {!orders.length ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
          {orders.map(({ id, product, orderStatus, address, pinCode }) => (
            <div
              key={id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {product?.image ? (
                <img
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h4 className="font-semibold">{product?.name}</h4>
              <p>₹{product?.price}</p>
              <p className="text-gray-600 text-sm">{product?.type}</p>
              <p className="text-gray-600 text-sm">📍 {address}</p>
              <p className="text-gray-500 text-sm">PIN: {pinCode}</p>

              <p
                className={`mt-2 font-semibold ${
                  orderStatus === "PLACED"
                    ? "text-green-600"
                    : orderStatus === "ONGOING"
                    ? "text-yellow-600"
                    : "text-gray-600"
                }`}
              >
                Status: {orderStatus}
              </p>

              <button
                onClick={() => handleCancel(id)}
                className="w-full mt-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;


// import { useEffect, useState } from "react";
// import { fetchUserOrders, deleteOrder } from "../services/orderApi";
// import api from "../services/api";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const email = localStorage.getItem("email");

//   useEffect(() => {
//     if (email) fetchOrders();
//   }, [email]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchUserOrders(email);

//       const products = await Promise.all(
//         data.map(async (order) => {
//           const res = await api.get(`/products/find-by-id/${order.productId}`);
//           return { ...order, product: res.data };
//         })
//       );
//       setOrders(products);
//     } catch (error) {
//       console.error("⚠️ Error fetching orders:", error);
//       alert("⚠️ Unable to load your orders right now. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const res = await deleteOrder(id);
//       alert(res.message || "✅ Order cancelled successfully!");
//       fetchOrders();
//     } catch (err) {
//       console.error("❌ Failed to cancel order:", err);
//       alert("❌ Could not cancel order. Please try again later.");
//     }
//   };

//   if (loading)
//     return <p className="text-center mt-10 text-lg">Loading your orders...</p>;

//   return (
//     <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//         🛍️ Your Orders
//       </h1>

//       {orders.length === 0 ? (
//         <p className="text-center text-gray-500 mt-10 text-lg">
//           You haven’t placed any orders yet.
//         </p>
//       ) : (
//         <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
//           {orders.map(({ id, product, orderStatus, address, pinCode }) => (
//             <div
//               key={id}
//               className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
//             >
//               {product?.image ? (
//                 <img
//                   src={`data:image/jpeg;base64,${product.image}`}
//                   alt={product.name}
//                   className="w-full h-48 object-cover rounded-lg mb-3"
//                 />
//               ) : (
//                 <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
//                   No Image
//                 </div>
//               )}

//               <h4 className="font-semibold">{product?.name}</h4>
//               <p>₹{product?.price}</p>
//               <p className="text-gray-600 text-sm">{product?.type}</p>
//               <p className="text-gray-600 text-sm">📍 {address}</p>
//               <p className="text-gray-500 text-sm">PIN: {pinCode}</p>
//               <p
//                 className={`mt-2 font-semibold ${
//                   orderStatus === "PLACED"
//                     ? "text-green-600"
//                     : orderStatus === "ONGOING"
//                     ? "text-yellow-600"
//                     : "text-gray-600"
//                 }`}
//               >
//                 Status: {orderStatus}
//               </p>

//               <button
//                 onClick={() => handleDelete(id)}
//                 className="w-full mt-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//               >
//                 Cancel Order
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;

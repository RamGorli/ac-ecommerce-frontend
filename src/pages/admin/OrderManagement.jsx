import { useEffect, useState } from "react";
import { fetchAllOrders } from "../../services/orderApi";
import api from "../../services/api";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAllOrders();

      const withProducts = await Promise.all(
        data.map(async (order) => {
          try {
            const res = await api.get(`/products/find-by-id/${order.productId}`);
            return { ...order, product: res.data };
          } catch (err) {
            if (err.response?.status === 404) {
              console.warn(`Product not found for order ${order.id}`);
              return { ...order, product: null };
            }
            throw err;
          }
        })
      );

      setOrders(withProducts);
    } catch (err) {
      console.error("Error loading orders:", err);
      alert("Some orders could not be loaded properly.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (order, newStatus) => {
    const updatedOrder = { ...order, orderStatus: newStatus };
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? updatedOrder : o))
    );

    try {
      await api.put("/orders/update", updatedOrder);
      console.log(`Order ${order.id} updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Could not update order status.");
      loadOrders();
    }
  };

  if (loading)
    return <p className="text-center text-lg mt-10">Loading orders...</p>;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
        Order Management
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">User Email</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b hover:bg-blue-50">
                  <td className="p-3">{o.id}</td>
                  <td className="p-3">{o.userEmail}</td>
                  <td className="p-3">
                    {o.product ? o.product.name : "Product not found"}
                  </td>
                  <td className="p-3">
                    {o.product ? `₹${o.product.price}` : "--"}
                  </td>
                  <td className="p-3 font-semibold">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o, e.target.value)}
                      className={`border rounded-lg px-2 py-1 font-semibold transition-colors duration-200 ${
                        o.orderStatus === "PLACED"
                          ? "bg-green-100 text-green-700"
                          : o.orderStatus === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-700"
                          : o.orderStatus === "DELIVERED"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELED">CANCELED</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(o.orderTime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;


















// import { useEffect, useState } from "react";
// import { fetchAllOrders, deleteOrder } from "../../services/orderApi";
// import api from "../../services/api";

// const OrderManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadOrders = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchAllOrders();

//       const withProducts = await Promise.all(
//         data.map(async (order) => {
//           try {
//             const res = await api.get(`/products/find-by-id/${order.productId}`);
//             return { ...order, product: res.data };
//           } catch (err) {
//             if (err.response?.status === 404) {
//               console.warn(`Product not found for order ${order.id}`);
//               return { ...order, product: null };
//             }
//             throw err;
//           }
//         })
//       );

//       setOrders(withProducts);
//     } catch (err) {
//       console.error("Error loading orders:", err);
//       alert("Some orders could not be loaded properly.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const handleStatusChange = async (order, newStatus) => {
//     const updatedOrder = { ...order, orderStatus: newStatus };
//     setOrders((prev) =>
//       prev.map((o) => (o.id === order.id ? updatedOrder : o))
//     );

//     try {
//       await api.put("/orders/update", updatedOrder);
//       console.log(`Order ${order.id} updated to ${newStatus}`);
//     } catch (err) {
//       console.error("Failed to update order:", err);
//       alert("Could not update order status.");
//       loadOrders();
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this order?")) return;

//     try {
//       await deleteOrder(id);
//       alert("Order deleted successfully!");
//       loadOrders();
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert("Could not delete order.");
//     }
//   };

//   if (loading)
//     return <p className="text-center text-lg mt-10">Loading orders...</p>;

//   return (
//     <div className="p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
//         Order Management
//       </h2>

//       {orders.length === 0 ? (
//         <p className="text-center text-gray-500 mt-10">No orders yet.</p>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
//           <table className="min-w-full border-collapse text-sm">
//             <thead className="bg-blue-100 text-gray-800">
//               <tr>
//                 <th className="p-3 text-left">Order ID</th>
//                 <th className="p-3 text-left">User Email</th>
//                 <th className="p-3 text-left">Product</th>
//                 <th className="p-3 text-left">Price</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Date</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((o) => (
//                 <tr key={o.id} className="border-b hover:bg-blue-50">
//                   <td className="p-3">{o.id}</td>
//                   <td className="p-3">{o.userEmail}</td>
//                   <td className="p-3">
//                     {o.product ? o.product.name : "Product not found"}
//                   </td>
//                   <td className="p-3">
//                     {o.product ? `₹${o.product.price}` : "--"}
//                   </td>
//                   <td className="p-3 font-semibold">
//                     <select
//                       value={o.orderStatus}
//                       onChange={(e) => handleStatusChange(o, e.target.value)}
//                       className={`border rounded-lg px-2 py-1 font-semibold transition-colors duration-200 ${
//                         o.orderStatus === "PLACED"
//                           ? "bg-green-100 text-green-700"
//                           : o.orderStatus === "IN_PROGRESS"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-gray-200 text-gray-700"
//                       }`}
//                     >
//                       <option value="PLACED">PLACED</option>
//                       <option value="IN_PROGRESS">IN_PROGRESS</option>
//                       <option value="DELIVERED">DELIVERED</option>
//                     </select>
//                   </td>
//                   <td className="p-3">
//                     {new Date(o.orderTime).toLocaleString()}
//                   </td>
//                   <td className="p-3">
//                     <button
//                       onClick={() => handleDelete(o.id)}
//                       className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderManagement;

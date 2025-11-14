// import { useEffect, useState } from "react";
// import { fetchAllOrders } from "../../services/orderApi";
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

//   if (loading)
//     return <p className="text-center text-lg mt-10">Loading orders...</p>;

//   return (
//     <div className="p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
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
//                 <th className="p-3 text-left">Image</th>
//                 <th className="p-3 text-left">Quantity</th>
//                 <th className="p-3 text-left">Price</th>
//                 <th className="p-3 text-left">Total</th>
//                 <th className="p-3 text-left">Delivery Type</th>
//                 <th className="p-3 text-left">Installation</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Order Date/Time</th>
//                 <th className="p-3 text-left">Address</th>
//                 <th className="p-3 text-left">PIN</th>
//                 <th className="p-3 text-left">Phone</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((o) => (
//                 <tr key={o.id} className="border-b hover:bg-blue-50">
//                   <td className="p-3">{o.id}</td>
//                   <td className="p-3">{o.userEmail}</td>
//                   <td className="p-3">{o.product?.name || "Not found"}</td>
//                   <td className="p-3">
//                     {o.product?.image ? (
//                       <img
//                         src={`data:image/jpeg;base64,${o.product.image}`}
//                         alt={o.product.name}
//                         className="w-12 h-12 object-cover rounded"
//                       />
//                     ) : (
//                       "--"
//                     )}
//                   </td>
//                   <td className="p-3">{o.quantity}</td>
//                   <td className="p-3">₹{o.productPrice}</td>
//                   <td className="p-3">₹{o.totalPrice}</td>
//                   <td className="p-3">{o.deliveryType}</td>
//                   <td className="p-3">{o.needInstallment ? "Yes" : "No"}</td>
//                   <td className="p-3 font-semibold">
//                     <select
//                       value={o.orderStatus}
//                       onChange={(e) => handleStatusChange(o, e.target.value)}
//                       className={`border rounded-lg px-2 py-1 font-semibold transition-colors duration-200 ${
//                         o.orderStatus === "PLACED"
//                           ? "bg-green-100 text-green-700"
//                           : o.orderStatus === "IN_PROGRESS"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : o.orderStatus === "DELIVERED"
//                           ? "bg-gray-200 text-gray-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       <option value="PLACED">PLACED</option>
//                       <option value="IN_PROGRESS">IN_PROGRESS</option>
//                       <option value="DELIVERED">DELIVERED</option>
//                       <option value="CANCELED">CANCELED</option>
//                     </select>
//                   </td>
//                   <td className="p-3">
//                     {o.orderTime
//                       ? new Date(o.orderTime).toLocaleString()
//                       : "--"}
//                   </td>
//                   <td className="p-3">{o.address}</td>
//                   <td className="p-3">{o.pinCode}</td>
//                   <td className="p-3">{o.phoneNumber}</td>
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
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Could not update order status.");
      loadOrders();
    }
  };

  if (loading)
    return <p className="text-center text-lg mt-10">Loading orders...</p>;

  if (!orders.length)
    return <p className="text-center text-gray-500 mt-10">No orders yet.</p>;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        All Orders
      </h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition"
          >
            <div className="flex items-center gap-4 mb-3">
              {o.product?.image ? (
                <img
                  src={`data:image/jpeg;base64,${o.product.image}`}
                  alt={o.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
                  No Image
                </div>
              )}
              <div>
                <h3 className="font-semibold text-blue-700">{o.product?.name || "Product not found"}</h3>
                <p className="text-gray-600 text-sm">Quantity: {o.quantity}</p>
                <p className="text-gray-600 text-sm">Price: ₹{o.productPrice}</p>
                <p className="text-gray-600 text-sm font-semibold">Total: ₹{o.totalPrice}</p>
              </div>
            </div>

            <div className="mb-2">
              <p className="text-gray-700 text-sm">
                Delivery: <span className="font-medium">{o.deliveryType}</span>
              </p>
              <p className="text-gray-700 text-sm">
                Installation: <span className="font-medium">{o.needInstallment ? "Yes" : "No"}</span>
              </p>
              <p className="text-gray-700 text-sm">
                Address: {o.address}, PIN: {o.pinCode}
              </p>
              <p className="text-gray-700 text-sm">Phone: {o.phoneNumber}</p>
              <p className="text-gray-700 text-sm">
                Order Date: {o.orderTime ? new Date(o.orderTime).toLocaleString() : "--"}
              </p>
            </div>

            <div className="mt-2 flex flex-col gap-2">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;

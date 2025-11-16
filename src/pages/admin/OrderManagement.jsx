
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

//       // Fetch product details for each order
//       const withProducts = await Promise.all(
//         data.map(async (order) => {
//           try {
//             const res = await api.get(`/products/find-by-id/${order.productId}`);
//             return { ...order, product: res.data };
//           } catch (err) {
//             console.warn(`Product not found for order ${order.id}`);
//             return { ...order, product: null };
//           }
//         })
//       );

//       setOrders(withProducts);
//     } catch (err) {
//       console.error("Error loading orders:", err);
//       alert("Failed to load orders.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const handleStatusChange = async (order, newStatus) => {
//     const updatedOrder = { ...order, orderStatus: newStatus };

//     // Update UI immediately
//     setOrders((prev) =>
//       prev.map((o) => (o.id === order.id ? updatedOrder : o))
//     );

//     try {
//       await api.put("/orders/update", updatedOrder);
//     } catch (err) {
//       alert("Failed to update order status.");
//       console.error(err);
//       loadOrders(); // revert UI
//     }
//   };

//   if (loading)
//     return <p className="text-center text-lg mt-10">Loading orders...</p>;

//   if (!orders.length)
//     return <p className="text-center text-gray-500 mt-10">No orders found.</p>;

//   return (
//     <div className="p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//         All Orders (Admin)
//       </h1>

//       <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//         {orders.map((o) => (
//           <div
//             key={o.id}
//             className="bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition"
//           >
//             {/* IMAGE */}
//             <div className="flex items-center gap-4 mb-3">
//               {o.product?.imageUrl ? (
//                 <img
//                   src={o.product.imageUrl}
//                   alt={o.product.name}
//                   className="w-20 h-20 object-cover rounded-lg"
//                 />
//               ) : (
//                 <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
//                   No Image
//                 </div>
//               )}

//               <div>
//                 <h3 className="font-semibold text-blue-700">
//                   {o.product?.name || "Product not found"}
//                 </h3>

//                 <p className="text-gray-700 text-sm">
//                   Unit Price: ₹{o.productPrice}
//                 </p>
//                 <p className="text-gray-700 text-sm">Qty: {o.quantity}</p>
//                 <p className="text-gray-900 font-semibold">
//                   Total: ₹{o.totalPrice}
//                 </p>
//               </div>
//             </div>

//             {/* ORDER DETAILS */}
//             <div className="mb-2 text-sm text-gray-700">
//               <p>
//                 Delivery: <span className="font-medium">{o.deliveryType}</span>
//               </p>
//               <p>
//                 Installation:{" "}
//                 <span className="font-medium">
//                   {o.needInstallment ? "Yes" : "No"}
//                 </span>
//               </p>
//               <p>
//                 Customer Email:{" "}
//                 <span className="font-medium">{o.userEmail}</span>
//               </p>
//               <p>
//                 Phone: <span className="font-medium">{o.phoneNumber}</span>
//               </p>
//               <p>
//                 Address: {o.address}, PIN: {o.pinCode}
//               </p>
//               <p>
//                 Ordered At:{" "}
//                 {o.orderTime
//                   ? new Date(o.orderTime).toLocaleString("en-IN", {
//                       dateStyle: "medium",
//                       timeStyle: "short",
//                     })
//                   : "--"}
//               </p>
//             </div>

//             {/* STATUS UPDATE DROPDOWN */}
//             <div className="mt-3">
//               <select
//                 value={o.orderStatus}
//                 onChange={(e) => handleStatusChange(o, e.target.value)}
//                 className={`border rounded-lg px-2 py-1 font-semibold w-full text-center cursor-pointer
//                   ${
//                     o.orderStatus === "PLACED"
//                       ? "bg-green-100 text-green-700"
//                       : o.orderStatus === "IN_PROGRESS"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : o.orderStatus === "DELIVERED"
//                       ? "bg-gray-200 text-gray-700"
//                       : "bg-red-100 text-red-700"
//                   }
//                 `}
//               >
//                 <option value="PLACED">PLACED</option>
//                 <option value="IN_PROGRESS">IN_PROGRESS</option>
//                 <option value="DELIVERED">DELIVERED</option>
//                 <option value="CANCELED">CANCELED</option>
//               </select>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrderManagement;


import { useEffect, useState } from "react";
import {
  fetchAllOrders,
  fetchOrdersByStatus,
  fetchOrdersByEmailAdmin,
  fetchOrdersByEmailAndStatus,
  updateOrder,
} from "../../services/orderApi";

import api from "../../services/api";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const size = 50;

  // Filters
  const [emailFilter, setEmailFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);

      let response;

      // CASE 1 → filter by email + status
      if (emailFilter && statusFilter) {
        response = await fetchOrdersByEmailAndStatus(
          emailFilter,
          statusFilter,
          page,
          size
        );
      }
      // CASE 2 → filter only by email
      else if (emailFilter) {
        response = await fetchOrdersByEmailAdmin(emailFilter, page, size);
      }
      // CASE 3 → filter only by status
      else if (statusFilter) {
        response = await fetchOrdersByStatus(statusFilter, page, size);
      }
      // CASE 4 → no filter → fetch all
      else {
        response = await fetchAllOrders(page, size);
      }

      const list = response.content || [];

      // Fetch product details
      const listWithProducts = await Promise.all(
        list.map(async (order) => {
          try {
            const pRes = await api.get(`/products/find-by-id/${order.productId}`);
            return { ...order, product: pRes.data };
          } catch {
            return { ...order, product: null };
          }
        })
      );

      setOrders(listWithProducts);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line
  }, [page, statusFilter]);

  // When email filter changes, reset page
  useEffect(() => {
    setPage(0);
    loadOrders();
    // eslint-disable-next-line
  }, [emailFilter]);

  const handleStatusUpdate = async (order, newStatus) => {
    const updated = { ...order, orderStatus: newStatus };

    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? updated : o))
    );

    try {
      await updateOrder(updated);
    } catch (err) {
      alert("Failed to update");
      loadOrders();
    }
  };

  const resetFilters = () => {
    setEmailFilter("");
    setStatusFilter("");
    setPage(0);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Management</h1>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="font-medium">Search by Email</label>
          <input
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value.trim())}
            placeholder="Enter user email"
            className="border px-3 py-2 rounded w-64"
          />
        </div>

        <div>
          <label className="font-medium">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded w-48"
          >
            <option value="">All</option>
            <option value="PLACED">PLACED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>

      {/* ORDERS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white shadow rounded-xl p-4 hover:shadow-lg"
          >
            {/* IMAGE */}
            <div className="flex gap-4">
              {o.product?.imageUrl ? (
                <img
                  src={o.product.imageUrl}
                  className="w-20 h-20 rounded object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                  No Image
                </div>
              )}

              <div>
                <h2 className="font-semibold text-blue-700">
                  {o.product?.name || "Product Deleted"}
                </h2>
                <p>₹{o.productPrice} × {o.quantity}</p>
                <p className="font-bold">Total: ₹{o.totalPrice}</p>
              </div>
            </div>

            <div className="text-sm mt-3">
              <p><b>Email:</b> {o.userEmail}</p>
              <p><b>Phone:</b> {o.phoneNumber}</p>
              <p><b>PIN:</b> {o.pinCode}</p>
              <p><b>Address:</b> {o.address}</p>
              <p><b>Ordered:</b> {new Date(o.orderTime).toLocaleString()}</p>
            </div>

            {/* Status Dropdown */}
            <select
              value={o.orderStatus}
              onChange={(e) => handleStatusUpdate(o, e.target.value)}
              className="mt-3 w-full border px-2 py-2 rounded-lg font-medium cursor-pointer"
            >
              <option value="PLACED">PLACED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;

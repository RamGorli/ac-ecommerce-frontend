
// import { useEffect, useState } from "react";
// import { fetchAllOrders, updateOrder } from "../../services/orderApi";
// import api from "../../services/api";

// const OrderManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(0);
//   const size = 50;

//   const [hasNext, setHasNext] = useState(false);
//   const [hasPrev, setHasPrev] = useState(false);

//   const loadOrders = async () => {
//     try {
//       setLoading(true);

//       const response = await fetchAllOrders(page, size);
//       const list = response.content || [];

//       setHasNext(!response.last);
//       setHasPrev(!response.first);

//       // attach product details
//       const withProducts = await Promise.all(
//         list.map(async (order) => {
//           try {
//             const p = await api.get(`/products/find-by-id/${order.productId}`);
//             return { ...order, product: p.data };
//           } catch {
//             return { ...order, product: null };
//           }
//         })
//       );

//       setOrders(withProducts);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, [page]);

//   const handleStatusUpdate = async (order, newStatus) => {
//     const updated = { ...order, orderStatus: newStatus };

//     setOrders((prev) =>
//       prev.map((o) => (o.id === order.id ? updated : o))
//     );

//     try {
//       await updateOrder(updated);
//     } catch (err) {
//       alert("Failed to update");
//       loadOrders();
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Order Management</h1>

//       {/* ORDERS GRID */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {orders.map((o) => (
//           <div key={o.id} className="bg-white shadow rounded-xl p-4 hover:shadow-lg">

//             {/* PRODUCT SECTION */}
//             <div className="flex gap-4">
//               {o.product?.imageUrl ? (
//                 <img
//                   src={o.product.imageUrl}
//                   className="w-20 h-20 rounded object-cover"
//                 />
//               ) : (
//                 <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
//                   No Image
//                 </div>
//               )}

//               <div>
//                 <h2 className="font-semibold text-blue-700">
//                   {o.product?.name || "Product Deleted"}
//                 </h2>
//                 <p>₹{o.productPrice} × {o.quantity}</p>
//                 <p className="font-bold">Total: ₹{o.totalPrice}</p>
//               </div>
//             </div>

//             {/* DETAILS */}
//             <div className="text-sm mt-3">
//               <p><b>Email:</b> {o.userEmail}</p>
//               <p><b>Phone:</b> {o.phoneNumber}</p>
//               <p><b>PIN:</b> {o.pinCode}</p>
//               <p><b>Add:</b> {o.address}</p>
//               <p><b>Time:</b> {new Date(o.orderTime).toLocaleString()}</p>
//             </div>

//             {/* COLORED STATUS DROPDOWN */}
//             <select
//               value={o.orderStatus}
//               onChange={(e) => handleStatusUpdate(o, e.target.value)}
//               className={`border rounded-lg px-2 py-2 font-semibold w-full text-center cursor-pointer mt-3
//                 ${
//                   o.orderStatus === "PLACED"
//                     ? "bg-green-100 text-green-700"
//                     : o.orderStatus === "IN_PROGRESS"
//                     ? "bg-yellow-100 text-yellow-700"
//                     : o.orderStatus === "DELIVERED"
//                     ? "bg-gray-200 text-gray-700"
//                     : "bg-red-100 text-red-700"
//                 }
//               `}
//             >
//               <option value="PLACED">PLACED</option>
//               <option value="IN_PROGRESS">IN_PROGRESS</option>
//               <option value="DELIVERED">DELIVERED</option>
//               <option value="CANCELED">CANCELED</option>
//             </select>
//           </div>
//         ))}
//       </div>

//       {/* PAGINATION CONTROLS (ONLY AT BOTTOM) */}
//       <div className="flex justify-center mt-8 gap-4">
//         <button
//           onClick={() => setPage((p) => Math.max(0, p - 1))}
//           disabled={!hasPrev}
//           className={`px-4 py-2 rounded-lg font-semibold 
//             ${hasPrev ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
//           `}
//         >
//           ← Previous
//         </button>

//         <button
//           onClick={() => setPage((p) => p + 1)}
//           disabled={!hasNext}
//           className={`px-4 py-2 rounded-lg font-semibold 
//             ${hasNext ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
//           `}
//         >
//           Next →
//         </button>
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
  const size = 8;
  const [hasMore, setHasMore] = useState(true);

  // FILTERS
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [emailFilter, setEmailFilter] = useState("");

  useEffect(() => {
    setOrders([]);
    setPage(0);
    loadOrders(0, true);
  }, [statusFilter, emailFilter]);

  useEffect(() => {
    if (page > 0) loadOrders(page, false);
  }, [page]);

  const loadOrders = async (pageToLoad, isReset) => {
    try {
      setLoading(true);

      let response;

      if (emailFilter && statusFilter !== "ALL") {
        response = await fetchOrdersByEmailAndStatus(
          emailFilter,
          statusFilter,
          pageToLoad,
          size
        );
      } else if (emailFilter) {
        response = await fetchOrdersByEmailAdmin(emailFilter, pageToLoad, size);
      } else if (statusFilter !== "ALL") {
        response = await fetchOrdersByStatus(statusFilter, pageToLoad, size);
      } else {
        response = await fetchAllOrders(pageToLoad, size);
      }

      const list = response.content || [];

      // attach product details
      const withProducts = await Promise.all(
        list.map(async (order) => {
          try {
            const p = await api.get(`/products/find-by-id/${order.productId}`);
            return { ...order, product: p.data };
          } catch {
            return { ...order, product: null };
          }
        })
      );

      if (isReset) {
        setOrders(withProducts);
      } else {
        setOrders((prev) => [...prev, ...withProducts]);
      }

      setHasMore(!response.last);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (order, newStatus) => {
    const updated = { ...order, orderStatus: newStatus };
    setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));

    try {
      await updateOrder(updated);
    } catch (err) {
      alert("Failed to update");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Management</h1>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="ALL">All Status</option>
          <option value="PLACED">PLACED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELED">CANCELED</option>
        </select>

        <input
          type="text"
          placeholder="Search by email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-64"
        />
      </div>

      {/* ORDERS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((o) => (
          <div key={o.id} className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition">
            
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

            {/* Customer Info */}
            <div className="text-sm mt-3">
              <p><b>Email:</b> {o.userEmail}</p>
              <p><b>Phone:</b> {o.phoneNumber}</p>
              <p><b>PIN:</b> {o.pinCode}</p>
              <p><b>Add:</b> {o.address}</p>
              <p><b>Installation:</b> {o.needInstallment ? "Yes" : "No"}</p>
              <p><b>Time:</b> {new Date(o.orderTime).toLocaleString()}</p>
            </div>

            {/* Status Dropdown */}
            <select
              value={o.orderStatus}
              onChange={(e) => handleStatusUpdate(o, e.target.value)}
              className={`border rounded-lg px-2 py-2 font-semibold w-full text-center cursor-pointer mt-3
                ${
                  o.orderStatus === "PLACED"
                    ? "bg-green-100 text-green-700"
                    : o.orderStatus === "IN_PROGRESS"
                    ? "bg-yellow-100 text-yellow-700"
                    : o.orderStatus === "DELIVERED"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >
              <option value="PLACED">PLACED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELED">CANCELED</option>
            </select>

          </div>
        ))}
      </div>

      {/* SHOW MORE */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? "Loading..." : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

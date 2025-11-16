

// import { useEffect, useState } from "react";
// import {
//   fetchAllOrders,
//   fetchOrdersByStatus,
//   fetchOrdersByEmailAdmin,
//   fetchOrdersByEmailAndStatus,
//   updateOrder,
// } from "../../services/orderApi";

// import api from "../../services/api";

// const OrderManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(0);
//   const size = 50;

//   // Filters
//   const [emailFilter, setEmailFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   const loadOrders = async () => {
//     try {
//       setLoading(true);

//       let response;

//       // CASE 1 → filter by email + status
//       if (emailFilter && statusFilter) {
//         response = await fetchOrdersByEmailAndStatus(
//           emailFilter,
//           statusFilter,
//           page,
//           size
//         );
//       }
//       // CASE 2 → filter only by email
//       else if (emailFilter) {
//         response = await fetchOrdersByEmailAdmin(emailFilter, page, size);
//       }
//       // CASE 3 → filter only by status
//       else if (statusFilter) {
//         response = await fetchOrdersByStatus(statusFilter, page, size);
//       }
//       // CASE 4 → no filter → fetch all
//       else {
//         response = await fetchAllOrders(page, size);
//       }

//       const list = response.content || [];

//       // Fetch product details
//       const listWithProducts = await Promise.all(
//         list.map(async (order) => {
//           try {
//             const pRes = await api.get(`/products/find-by-id/${order.productId}`);
//             return { ...order, product: pRes.data };
//           } catch {
//             return { ...order, product: null };
//           }
//         })
//       );

//       setOrders(listWithProducts);
//     } catch (err) {
//       console.error("Error:", err);
//       alert("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//     // eslint-disable-next-line
//   }, [page, statusFilter]);

//   // When email filter changes, reset page
//   useEffect(() => {
//     setPage(0);
//     loadOrders();
//     // eslint-disable-next-line
//   }, [emailFilter]);

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

//   const resetFilters = () => {
//     setEmailFilter("");
//     setStatusFilter("");
//     setPage(0);
//   };

//   if (loading) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Order Management</h1>

//       {/* FILTERS */}
//       <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-end">
//         <div>
//           <label className="font-medium">Search by Email</label>
//           <input
//             value={emailFilter}
//             onChange={(e) => setEmailFilter(e.target.value.trim())}
//             placeholder="Enter user email"
//             className="border px-3 py-2 rounded w-64"
//           />
//         </div>

//         <div>
//           <label className="font-medium">Status</label>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="border px-3 py-2 rounded w-48"
//           >
//             <option value="">All</option>
//             <option value="PLACED">PLACED</option>
//             <option value="IN_PROGRESS">IN_PROGRESS</option>
//             <option value="DELIVERED">DELIVERED</option>
//             <option value="CANCELED">CANCELED</option>
//           </select>
//         </div>

//         <button
//           onClick={resetFilters}
//           className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//         >
//           Reset
//         </button>
//       </div>

//       {/* ORDERS GRID */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {orders.map((o) => (
//           <div
//             key={o.id}
//             className="bg-white shadow rounded-xl p-4 hover:shadow-lg"
//           >
//             {/* IMAGE */}
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

//             <div className="text-sm mt-3">
//               <p><b>Email:</b> {o.userEmail}</p>
//               <p><b>Phone:</b> {o.phoneNumber}</p>
//               <p><b>PIN:</b> {o.pinCode}</p>
//               <p><b>Address:</b> {o.address}</p>
//               <p><b>Ordered:</b> {new Date(o.orderTime).toLocaleString()}</p>
//             </div>

//             {/* Status Dropdown */}
//             <select
//               value={o.orderStatus}
//               onChange={(e) => handleStatusUpdate(o, e.target.value)}
//               className="mt-3 w-full border px-2 py-2 rounded-lg font-medium cursor-pointer"
//             >
//               <option value="PLACED">PLACED</option>
//               <option value="IN_PROGRESS">IN_PROGRESS</option>
//               <option value="DELIVERED">DELIVERED</option>
//               <option value="CANCELED">CANCELED</option>
//             </select>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrderManagement;



import { useEffect, useState } from "react";
import { fetchAllOrders, updateOrder } from "../../services/orderApi";
import api from "../../services/api";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const size = 50;

  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const response = await fetchAllOrders(page, size);
      const list = response.content || [];

      setHasNext(!response.last);    // if last = true → no next page
      setHasPrev(!response.first);   // if first = true → no previous page

      // Attach product details
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

      setOrders(withProducts);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Management</h1>

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={!hasPrev}
          className={`px-4 py-2 rounded-lg font-semibold 
            ${hasPrev ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
          `}
        >
          ← Previous
        </button>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNext}
          className={`px-4 py-2 rounded-lg font-semibold 
            ${hasNext ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
          `}
        >
          Next →
        </button>
      </div>

      {/* ORDERS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((o) => (
          <div key={o.id} className="bg-white shadow rounded-xl p-4 hover:shadow-lg">
            
            {/* PRODUCT SECTION */}
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

            {/* DETAILS */}
            <div className="text-sm mt-3">
              <p><b>Email:</b> {o.userEmail}</p>
              <p><b>Phone:</b> {o.phoneNumber}</p>
              <p><b>PIN:</b> {o.pinCode}</p>
              <p><b>Add:</b> {o.address}</p>
              <p><b>Time:</b> {new Date(o.orderTime).toLocaleString()}</p>
            </div>

            {/* COLORED STATUS DROPDOWN */}
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

      {/* PAGINATION CONTROLS (BOTTOM) */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={!hasPrev}
          className={`px-4 py-2 rounded-lg font-semibold 
            ${hasPrev ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
          `}
        >
          ← Previous
        </button>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNext}
          className={`px-4 py-2 rounded-lg font-semibold 
            ${hasNext ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
          `}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default OrderManagement;

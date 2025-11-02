// import React from 'react'

// const OrderManagement = () => {
//   return (
//     <div className="text-4xl sm:text-5xl font-bold text-blue-900 text-center my-8">
//       Order Management
//     </div>  
//   )
// }

// export default OrderManagement;


import { useEffect, useState } from "react";
import {
  fetchAllOrders,
  deleteOrder,
} from "../../services/orderApi";
import api from "../../services/api";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAllOrders();

      // Fetch product info for each order
      const withProducts = await Promise.all(
        data.map(async (order) => {
          const res = await api.get(`/products/find-by-id/${order.productId}`);
          return { ...order, product: res.data };
        })
      );

      setOrders(withProducts);
    } catch (err) {
      console.error("❌ Error loading orders:", err);
      alert("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // const handleStatusChange = async (id, newStatus) => {
  //   try {
  //     await updateOrderStatus(id, newStatus);
  //     alert("✅ Status updated successfully!");
  //     loadOrders();
  //   } catch (err) {
  //     console.error("❌ Failed to update status:", err);
  //     alert("Could not update status.");
  //   }
  // };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Temporarily simulate success
      alert(`✅ Status for order ${id} changed to ${newStatus} (UI only)`);

    } catch (err) {
      console.error("❌ Failed to update status:", err);
      alert("Could not update status.");
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      alert("🗑 Order deleted successfully!");
      loadOrders();
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  if (loading)
    return <p className="text-center text-lg mt-10">Loading orders...</p>;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
        📦 Order Management
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
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b hover:bg-blue-50">
                  <td className="p-3">{o.id}</td>
                  <td className="p-3">{o.userEmail}</td>
                  <td className="p-3">{o.product?.name || "Unknown"}</td>
                  <td className="p-3">₹{o.product?.price}</td>
                  <td className="p-3 font-semibold">
                    <select
                      value={o.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(o.id, e.target.value)
                      }
                      className={`border rounded-lg px-2 py-1 ${
                        o.orderStatus === "PLACED"
                          ? "bg-green-100 text-green-700"
                          : o.orderStatus === "ONGOING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="ONGOING">ONGOING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(o.orderTime).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(o.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
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

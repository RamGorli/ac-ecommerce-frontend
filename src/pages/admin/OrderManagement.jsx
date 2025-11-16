
import { useEffect, useState } from "react";
import {
  fetchAllOrders,
  fetchOrdersByStatus,
  updateOrder,
} from "../../services/orderApi";
import { fetchProductById } from "../../services/productApi";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const size = 6;
  const [hasMore, setHasMore] = useState(true);

  // FILTER — only status
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    setOrders([]);
    setPage(0);
    loadOrders(0, true);
  }, [statusFilter]);

  useEffect(() => {
    if (page > 0) loadOrders(page, false);
  }, [page]);

  const loadOrders = async (pageToLoad, isReset) => {
    try {
      setLoading(true);
      let response;

      if (statusFilter !== "ALL") {
        response = await fetchOrdersByStatus(statusFilter, pageToLoad, size);
      } else {
        response = await fetchAllOrders(pageToLoad, size);
      }

      const list = response.content || [];

      const withProducts = await Promise.all(
        list.map(async (order) => {
          try {
            const product = await fetchProductById(order.productId);
            return { ...order, product };
          } catch {
            return { ...order, product: null };
          }
        })
      );

      if (isReset) setOrders(withProducts);
      else setOrders((prev) => [...prev, ...withProducts]);

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
      alert("Failed to update order status");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">All Orders</h1>

      {/* FILTERS */}
      <div className="flex justify-center mb-6">
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
      </div>

      {/* ORDERS GRID */}
      {!orders.length && !loading ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No orders found.
        </p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition"
              >
                <div className="flex gap-4">
                  {o.product?.imageUrl ? (
                    <img
                      src={o.product.imageUrl}
                      className="w-20 h-20 rounded object-cover"
                      alt={o.product.name}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  <div className="flex-1">
                    <h2 className="font-semibold text-blue-700 truncate">
                      {o.product?.name || "Product Deleted"}
                    </h2>
                    <p>
                      AUD ${o.productPrice} × {o.quantity}
                    </p>
                    <p className="font-bold">Total: AUD ${o.totalPrice}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="text-sm mt-3">
                  <p>
                    <b>Email:</b> {o.userEmail}
                  </p>
                  <p>
                    <b>Phone:</b> {o.phoneNumber}
                  </p>
                  <p>
                    <b>PIN:</b> {o.pinCode}
                  </p>
                  <p>
                    <b>Address:</b> {o.address}
                  </p>
                  <p>
                    <b>Installation:</b> {o.needInstallment ? "Yes" : "No"}
                  </p>
                  <p>
                    <b>Time:</b> {new Date(o.orderTime).toLocaleString()}
                  </p>
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
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Loading..." : "Show More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderManagement;

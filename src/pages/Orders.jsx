
import { useEffect, useState } from "react";
import { fetchUserOrders } from "../services/orderApi";
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
          try {
            const res = await api.get(`/products/find-by-id/${order.productId}`);
            return { ...order, product: res.data };
          } catch {
            return { ...order, product: null };
          }
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

  const handleCancel = async (order) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    const updatedOrder = { ...order, orderStatus: "CANCELED" };

    try {
      await api.put("/orders/update", updatedOrder);
      alert("Order has been cancelled successfully!");
      fetchOrders();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Could not cancel order. Please try again later.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading your orders...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🛍️ Your Orders</h1>

      {!orders.length ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {order.product?.image ? (
                <img
                  src={`data:image/jpeg;base64,${order.product.image}`}
                  alt={order.product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h4 className="font-semibold">{order.product?.name}</h4>
              <p>₹{order.product?.price}</p>
              <p className="text-gray-600 text-sm">{order.product?.type}</p>
              <p className="text-gray-500 text-sm">{order.address}</p>
              <p className="text-gray-500 text-sm">PIN: {order.pinCode}</p>

              <p
                className={`mt-2 font-semibold ${
                  order.orderStatus === "PLACED"
                    ? "text-green-600"
                    : order.orderStatus === "IN_PROGRESS"
                    ? "text-yellow-600"
                    : order.orderStatus === "DELIVERED"
                    ? "text-gray-600"
                    : "text-red-600"
                }`}
              >
                Status: {order.orderStatus}
              </p>

              {order.orderStatus !== "DELIVERED" &&
                order.orderStatus !== "CANCELED" && (
                  <button
                    onClick={() => handleCancel(order)}
                    className="w-full mt-3 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel Order
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;











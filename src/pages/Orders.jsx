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

      // ✅ Attach product details
      const products = await Promise.all(
        data.map((order) =>
          api.get(`/products/find-by-id/${order.productId}`).then((res) => ({
            ...order,
            product: res.data,
          }))
        )
      );
      setOrders(products);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Error fetching your orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      alert("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading your orders...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
        🛍️ Your Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
          {orders.map(({ id, product, orderStatus, address, pinCode }) => (
            <div
              key={id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col h-full"
            >
              {product?.image ? (
                <img
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                  className="w-full h-56 object-cover rounded-xl mb-3"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 rounded-xl mb-3 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h2 className="text-lg font-semibold mb-1 truncate">
                {product?.name || "Unknown Product"}
              </h2>
              <p className="text-gray-600 text-sm mb-1">Type: {product?.type}</p>
              <p className="text-gray-600 text-sm mb-1">📍 {address}</p>
              <p className="text-gray-600 text-sm mb-2">PIN: {pinCode}</p>
              <p className="font-bold text-lg mb-2 text-blue-600">
                ₹{product?.price}
              </p>

              <p
                className={`font-semibold mb-4 ${
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
                onClick={() => handleDelete(id)}
                className="w-full py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
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

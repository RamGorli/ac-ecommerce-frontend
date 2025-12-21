
import { useEffect, useState } from "react";
import { fetchUserOrders, updateOrder } from "../services/orderApi";
import { fetchProductById } from "../services/productApi";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Check for logged-in email or guest email
  const email = localStorage.getItem("email") || localStorage.getItem("guestEmail");
  const navigate = useNavigate();
  const pageSize = 8;

  useEffect(() => {
    if (!email) {
      // No email available → redirect to login or show message
      alert("No user email found. Please log in or place an order as guest first.");
      navigate("/login");
      return;
    }
    fetchOrders(currentPage);
  }, [email, currentPage, navigate]);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const pageData = await fetchUserOrders(email, page, pageSize);

      const detailedOrders = await Promise.all(
        pageData.content.map(async (order) => {
          try {
            const product = await fetchProductById(order.productId);
            return { ...order, product };
          } catch {
            return { ...order, product: null };
          }
        })
      );

      setOrders((prev) => [...prev, ...detailedOrders]);
      const isLastPage = pageData.page.number >= pageData.page.totalPages - 1;
      setHasMore(!isLastPage);
    } catch (err) {
      console.error(err);
      alert("Unable to load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (order) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    const updatedOrder = { ...order, orderStatus: "CANCELED" };

    try {
      await updateOrder(updatedOrder);
      alert("Order cancelled successfully!");
      setOrders([]);
      setCurrentPage(0);
      setHasMore(true);

      fetchOrders(0);
    } catch (err) {
      console.error(err);
      alert("Could not cancel order. Please try again later.");
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) setCurrentPage((prev) => prev + 1);
  };

  if (!orders.length && loading)
    return <p className="text-center mt-10 text-lg">Loading your orders...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Orders
      </h1>

      {!orders.length ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() =>
                  order.product && navigate(`/products/${order.product.id}`)
                }
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
              >
                {order.product?.imageUrl ? (
                  <img
                    src={order.product.imageUrl}
                    alt={order.product.name}
                    className="w-full h-48 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <h4 className="font-semibold text-blue-700 group-hover:underline truncate">
                  {order.product?.name || "Product Deleted"}
                </h4>

                <p className="text-gray-800">
                  AUD ${order.productPrice} × {order.quantity}
                </p>

                <p className="text-gray-900 font-semibold">
                  Total: AUD ${order.totalPrice}
                </p>

                <p className="text-gray-600 text-sm">
                  Delivery: {order.deliveryType}
                </p>

                {order.needInstallment && (
                  <p className="text-gray-600 text-sm">Installation: Added</p>
                )}

                {order.orderTime && (
                  <p className="text-gray-500 text-sm">
                    Ordered on:{" "}
                    {new Date(order.orderTime).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}

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
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(order);
                      }}
                      className="mt-1 text-sm text-red-600 hover:text-red-700 cursor-pointer w-fit"
                    >
                      Cancel Order
                    </div>
                  )}
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
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

export default Orders;

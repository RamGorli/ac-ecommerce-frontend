import { useEffect, useState } from "react";
import { fetchUserOrders } from "../services/orderApi";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (email) fetchOrders(page);
  }, [email, page]);

  const fetchOrders = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const data = await fetchUserOrders(email, pageNumber, 8); // 8 orders per page

      // data.content contains the paginated list
      const detailedOrders = await Promise.all(
        data.content.map(async (order) => {
          try {
            const res = await api.get(`/products/find-by-id/${order.productId}`);
            return { ...order, product: res.data };
          } catch {
            return { ...order, product: null };
          }
        })
      );

      setOrders(detailedOrders);
      setTotalPages(data.totalPages);
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
      fetchOrders(page);
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Could not cancel order. Please try again later.");
    }
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  if (loading)
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
                {order.product?.image ? (
                  <img
                    src={`data:image/jpeg;base64,${order.product.image}`}
                    alt={order.product.name}
                    className="w-full h-48 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <h4 className="font-semibold text-blue-700 group-hover:underline">
                  {order.product?.name}
                </h4>
                <p className="text-gray-800 font-medium">
                  ₹{order.product?.price}
                </p>
                <p className="text-gray-600 text-sm group-hover:underline">
                  {order.product?.type}
                </p>
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

          {/* Pagination controls */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
            >
              Prev
            </button>
            <span className="px-4 py-2">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;

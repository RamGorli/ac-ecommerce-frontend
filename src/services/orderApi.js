import api from "./api";

// Add a single order
export const placeOrder = async (order) => {
  const res = await api.post("/orders/add", order);
  return res.data;
};

// Add multiple orders at once (bulk checkout)
export const placeMultipleOrders = async (orders) => {
  const res = await api.post("/orders/add-all", orders);
  return res.data;
};

// Fetch all orders for a user by email
export const fetchUserOrders = async (email) => {
  const res = await api.get(`/orders/find-by-email/${email}`);
  return res.data;
};

// Delete an order (admin or user cancel)
export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/delete/${id}`);
  return res.data;
};

// Fetch order by ID
export const fetchOrderById = async (id) => {
  const res = await api.get(`/orders/find-by-id/${id}`);
  return res.data;
};

// Fetch all orders (admin dashboard)
export const fetchAllOrders = async () => {
  const res = await api.get("/orders/find-all");
  return res.data;
};

// Fetch user orders filtered by status (PLACED, COMPLETED, etc.)
export const fetchUserOrdersByStatus = async (email, status) => {
  const res = await api.get(`/orders/find-by-email-status/${email}/${status}`);
  return res.data;
};

// Fetch all orders by status (for admin)
export const fetchOrdersByStatus = async (status) => {
  const res = await api.get(`/orders/find-by-status/${status}`);
  return res.data;
};

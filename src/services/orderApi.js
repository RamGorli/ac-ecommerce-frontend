import api from "./api";

// Place a single order
export const placeOrder = async (order) => {
  const res = await api.post("/orders/add", order);
  return res.data;
};

// Place multiple orders (bulk)
export const placeMultipleOrders = async (orders) => {
  const res = await api.post("/orders/add-all", orders);
  return res.data;
};

// Fetch paginated orders for a user (returns only orders array)
export const fetchUserOrders = async (email, page = 0, size = 10) => {
  const res = await api.get(`/orders/find-by-email/${email}?page=${page}&size=${size}`);
  return res.data.content; // only orders array
};

// Fetch user orders by status
export const fetchUserOrdersByStatus = async (email, status, page = 0, size = 10) => {
  const res = await api.get(`/orders/find-by-email-status/${email}/${status}?page=${page}&size=${size}`);
  return res.data.content; // only orders array
};

// Update order (cancel, status change)
export const updateOrder = async (order) => {
  const res = await api.put("/orders/update", order);
  return res.data;
};

// Fetch order by ID
export const fetchOrderById = async (id) => {
  const res = await api.get(`/orders/find-by-id/${id}`);
  return res.data;
};

// Fetch all orders (admin)
export const fetchAllOrders = async (page = 0, size = 10) => {
  const res = await api.get(`/orders/find-all?page=${page}&size=${size}`);
  return res.data.content; // only orders array
};

// Fetch orders by status (admin)
export const fetchOrdersByStatus = async (status, page = 0, size = 10) => {
  const res = await api.get(`/orders/find-by-status/${status}?page=${page}&size=${size}`);
  return res.data.content; // only orders array
};

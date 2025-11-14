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

// Fetch user orders by email (paginated)
export const fetchUserOrders = async (email, page = 0, size = 10) => {
  const res = await api.get(`/orders/find-by-email/${email}?page=${page}&size=${size}`);
  return res.data.content; // Return only the array
};

// Fetch user orders filtered by status (paginated)
export const fetchUserOrdersByStatus = async (email, status, page = 0, size = 10) => {
  const res = await api.get(`/orders/find-by-email-status/${email}/${status}?page=${page}&size=${size}`);
  return res.data.content;
};

// Fetch all orders (admin) paginated
export const fetchAllOrders = async (page = 0, size = 10) => {
  const res = await api.get(`/orders/find-all?page=${page}&size=${size}`);
  return res.data.content;
};

// Fetch all orders by status (admin) paginated
export const fetchOrdersByStatus = async (status, page = 0, size = 10) => {
  const res = await api.get(`/orders/find-by-status/${status}?page=${page}&size=${size}`);
  return res.data.content;
};

// Fetch order by ID
export const fetchOrderById = async (id) => {
  const res = await api.get(`/orders/find-by-id/${id}`);
  return res.data;
};

// Delete an order
export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/delete/${id}`);
  return res.data;
};

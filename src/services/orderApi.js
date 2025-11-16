import api from "./api";

// Add a single order
export const placeOrder = async (order) => {
  const res = await api.post("/orders/add", order);
  return res.data;
};

// Add multiple orders at once
export const placeMultipleOrders = async (orders) => {
  const res = await api.post("/orders/add-all", orders);
  return res.data;
};

// Fetch user orders by email (paginated)
export const fetchUserOrders = async (email, page = 0, size = 10) => {
  const res = await api.get(
    `/orders/find-by-email/${email}?page=${page}&size=${size}`
  );
  return res.data; // return whole page object
};

// Fetch user orders filtered by status
export const fetchUserOrdersByStatus = async (email, status, page = 0, size = 10) => {
  const res = await api.get(
    `/orders/find-by-email-status/${email}/${status}?page=${page}&size=${size}`
  );
  return res.data;
};

// ADMIN: Fetch all orders (paginated)
export const fetchAllOrders = async (page = 0, size = 10) => {
  const res = await api.get(`/orders/find-all?page=${page}&size=${size}`);
  return res.data;
};

// ADMIN: Fetch all orders by status
export const fetchOrdersByStatus = async (status, page = 0, size = 10) => {
  const res = await api.get(
    `/orders/find-by-status/${status}?page=${page}&size=${size}`
  );
  return res.data;
};

// ADMIN: Fetch orders by user email
export const fetchOrdersByEmailAdmin = async (email, page = 0, size = 10) => {
  const res = await api.get(
    `/orders/find-by-email/${email}?page=${page}&size=${size}`
  );
  return res.data;
};

// ADMIN: Fetch orders by email + status
export const fetchOrdersByEmailAndStatus = async (email, status, page = 0, size = 10) => {
  const res = await api.get(
    `/orders/find-by-email-status/${email}/${status}?page=${page}&size=${size}`
  );
  return res.data;
};

// Fetch order by ID
export const fetchOrderById = async (id) => {
  const res = await api.get(`/orders/find-by-id/${id}`);
  return res.data;
};

// Update order
export const updateOrder = async (order) => {
  const res = await api.put("/orders/update", order);
  return res.data;
};

// import api from "./api";

// // Place an order
// export const placeOrder = async (email, productId) => {
//   const res = await api.post(`/orders/place/${email}/${productId}`);
//   return res.data;
// };

// // Fetch all orders for a user
// export const fetchUserOrders = async (email) => {
//   const res = await api.get(`/orders/find-by-email/${email}`);
//   return res.data;
// };

// // Delete an order (optional, for admin/user cancel)
// export const deleteOrder = async (id) => {
//   const res = await api.delete(`/orders/delete/${id}`);
//   return res.data;
// };



import api from "./api";

/**
 * Add a single order
 * @param {Object} order - Order object containing all order details
 */
export const placeOrder = async (order) => {
  // Backend expects the whole order object in POST body (not email/id path params)
  const res = await api.post(`/orders/add`, order);
  return res.data;
};

/**
 * Add multiple orders at once (optional, for bulk checkout)
 * @param {Array} orders - List of orders
 */
export const placeMultipleOrders = async (orders) => {
  const res = await api.post(`/orders/add-all`, orders);
  return res.data;
};

/**
 * Fetch all orders for a user (by email)
 * @param {string} email
 */
export const fetchUserOrders = async (email) => {
  const res = await api.get(`/orders/find-by-email/${email}`);
  return res.data;
};

/**
 * Delete an order (for admin/user cancel)
 * @param {number} id - Order ID
 */
export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/delete/${id}`);
  return res.data;
};

/**
 * Fetch order by ID
 * @param {number} id - Order ID
 */
export const fetchOrderById = async (id) => {
  const res = await api.get(`/orders/find-by-id/${id}`);
  return res.data;
};

/**
 * Fetch all orders (for admin dashboard)
 */
export const fetchAllOrders = async () => {
  const res = await api.get(`/orders/find-all`);
  return res.data;
};

/**
 * Fetch orders by email and status
 * @param {string} email
 * @param {string} status - Enum from backend (e.g., PLACED, SHIPPED, DELIVERED)
 */
export const fetchUserOrdersByStatus = async (email, status) => {
  const res = await api.get(`/orders/find-by-email-status/${email}/${status}`);
  return res.data;
};

/**
 * Fetch all orders by status (for admin)
 * @param {string} status
 */
export const fetchOrdersByStatus = async (status) => {
  const res = await api.get(`/orders/find-by-status/${status}`);
  return res.data;
};

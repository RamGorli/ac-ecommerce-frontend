import api from "./api";

// Place an order
export const placeOrder = async (email, productId) => {
  const res = await api.post(`/orders/place/${email}/${productId}`);
  return res.data;
};

// Fetch all orders for a user
export const fetchUserOrders = async (email) => {
  const res = await api.get(`/orders/find-by-email/${email}`);
  return res.data;
};

// Delete an order (optional, for admin/user cancel)
export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/delete/${id}`);
  return res.data;
};

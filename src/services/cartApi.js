import api from "./api";
export const addToCart = async (email, productId) => {
  const response = await api.put(`/user/add-to-cart/${email}/${productId}`);
  return response.data;
};

export const removeFromCart = async (email, productId) => {
  const response = await api.put(`/user/delete-from-cart/${email}/${productId}`);
  return response.data;
};

export const emptyCart = async (email) => {
  const response = await api.put(`/user/empty-cart/${email}`);
  return response.data;
};

export const getCart = async (email) => {
  const response = await api.put(`/user/get-cart/${email}`);
  return response.data;
};

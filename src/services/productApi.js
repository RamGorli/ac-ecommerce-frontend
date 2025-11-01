import api from "./api";

// Fetch all products
export const fetchAllProducts = async () => {
  const res = await api.get("/products/find-all");
  return res.data;
};

// Add product (admin)
export const addProduct = async (product) => {
  const res = await api.post("/products/add", product);
  return res.data;
};

// Update product (admin)
export const updateProduct = async (product) => {
  const res = await api.put("/products/update", product);
  return res.data;
};

// Delete product (admin)
// export const deleteProduct = async (product) => {
//   const res = await api.delete("/products/delete", { data: product });
//   return res.data;
// };
export const deleteProduct = async (product) => {
  const res = await api.delete("/products/delete", {
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(product),
  });
  return res.data;
};


import api from "./api";

// Fetch all products (paged)
export const fetchAllProducts = async (page = 0, size = 10) => {
  const res = await api.get(`/products/find-all?page=${page}&size=${size}`);
  return res.data.content;
};

// Add a single product
export const addProduct = async (product) => {
  const res = await api.post("/products/add", product);
  return res.data;
};

// Add all products (bulk)
export const addAllProducts = async (products) => {
  const res = await api.post("/products/add-all", products);
  return res.data;
};

// Find product by ID
export const fetchProductById = async (id) => {
  const res = await api.get(`/products/find-by-id/${id}`);
  return res.data;
};

// Fetch by type (paged)
export const fetchProductsByType = async (type, page = 0, size = 10) => {
  const res = await api.get(
    `/products/find-by-type?type=${type}&page=${page}&size=${size}`
  );
  return res.data.content;
};

// Fetch products with price < x
export const fetchProductsLessThan = async (price, page = 0, size = 10) => {
  const res = await api.get(
    `/products/less-than?price=${price}&page=${page}&size=${size}`
  );
  return res.data.content;
};

// Fetch products with price > x
export const fetchProductsGreaterThan = async (price, page = 0, size = 10) => {
  const res = await api.get(
    `/products/greater-than?price=${price}&page=${page}&size=${size}`
  );
  return res.data.content;
};

// Update product
export const updateProduct = async (product) => {
  const res = await api.put("/products/update", product);
  return res.data;
};

// Delete product
export const deleteProduct = async (product) => {
  const res = await api.delete("/products/delete", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(product),
  });
  return res.data;
};


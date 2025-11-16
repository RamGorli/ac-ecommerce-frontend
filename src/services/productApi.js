import api from "./api";

// Fetch paged products with filters
export const fetchFilteredProducts = async ({
  brand = "",
  capacity = "",
  type = "",
  minPrice = "",
  maxPrice = "",
  page = 0,
  size = 10,
  sortBy = "price",
  sortDir = "asc",
}) => {
  const params = new URLSearchParams();

  if (brand) params.append("brand", brand);
  if (capacity) params.append("capacity", capacity);
  if (type) params.append("type", type);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);

  params.append("page", page);
  params.append("size", size);
  params.append("sortBy", sortBy);
  params.append("sortDir", sortDir);

  const res = await api.get(`/products/everyone/find-all?${params.toString()}`);
  return res.data; // backend returns { content: [], totalPages, totalElements ... }
};

// Add product
export const addProduct = async (formData) => {
  const res = await api.post("/products/admin/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Add all products (bulk)
export const addAllProducts = async (products) => {
  const res = await api.post("/products/admin/add-all", products);
  return res.data;
};

// Find product by ID
export const fetchProductById = async (id) => {
  const res = await api.get(`/products/everyone/find-by-id/${id}`);
  return res.data;
};

// Update product
export const updateProduct = async (formData) => {
  const res = await api.put("/products/admin/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete product
export const deleteProduct = async (product) => {
  const res = await api.delete("/products/admin/delete", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(product),
  });
  return res.data;
};

// Fetch dropdown data (types, brands, capacities)
export const fetchDropdownData = async () => {
  const res = await api.get("/products/everyone/dropdown-data");
  return res.data;
};

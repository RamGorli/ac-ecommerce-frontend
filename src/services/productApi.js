import api from "./api";

// Fetch ALL products with pagination
export const fetchAllProducts = async (page = 0, size = 1000) => {
  try {
    const res = await api.get(`/products/find-all?page=${page}&size=${size}`);
    return res.data.content || [];
  } catch (err) {
    console.error("Error fetching all products:", err);
    return [];
  }
};

// Fetch products by type
export const fetchProductsByType = async (type, page = 0, size = 1000) => {
  try {
    const res = await api.get(
      `/products/find-by-type?type=${type}&page=${page}&size=${size}`
    );
    return res.data.content || [];
  } catch (err) {
    console.error("Error fetching by type:", err);
    return [];
  }
};

// Fetch products by price < X
export const fetchProductsLessThan = async (price, page = 0, size = 1000) => {
  try {
    const res = await api.get(
      `/products/less-than?price=${price}&page=${page}&size=${size}`
    );
    return res.data.content || [];
  } catch (err) {
    console.error("Error fetching less-than:", err);
    return [];
  }
};

// Fetch products by price > X
export const fetchProductsGreaterThan = async (price, page = 0, size = 1000) => {
  try {
    const res = await api.get(
      `/products/greater-than?price=${price}&page=${page}&size=${size}`
    );
    return res.data.content || [];
  } catch (err) {
    console.error("Error fetching greater-than:", err);
    return [];
  }
};

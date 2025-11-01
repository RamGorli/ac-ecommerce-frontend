import api from "./api";

// Fetch all products
export const fetchAllProducts = async () => {
  const res = await api.get("/products/find-all");
  return res.data;
};

// Add product (admin)
export const addProduct = async (product) => {
  try {
    const res = await api.post("/products/add", product);
    return res.data;
  } catch (err) {
    // Handle false 500 (backend operation succeeded but response failed)
    if (
      err.response?.status === 500 &&
      err.response?.data?.includes("No acceptable representation")
    ) {
      return { message: "Product added successfully (handled locally)" };
    }
    throw err;
  }
};

// Update product (admin)
export const updateProduct = async (product) => {
  try {
    const res = await api.put("/products/update", product);
    return res.data;
  } catch (err) {
    if (
      err.response?.status === 500 &&
      err.response?.data?.includes("No acceptable representation")
    ) {
      return { message: "Product updated successfully (handled locally)" };
    }
    throw err;
  }
};

// Delete product (admin)
export const deleteProduct = async (product) => {
  try {
    const res = await api.delete("/products/delete", {
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(product),
    });
    return res.data;
  } catch (err) {
    if (
      err.response?.status === 500 &&
      err.response?.data?.includes("No acceptable representation")
    ) {
      return { message: "Product deleted successfully (handled locally)" };
    }
    throw err;
  }
};



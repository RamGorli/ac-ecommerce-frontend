// import api from "./api";

// export const fetchAllProducts = async () => {
//   const res = await api.get("/products/find-all");
//   return res.data;
// };


// export const addProduct = async (product) => {
//   try {
//     const res = await api.post("/products/add", product);
//     return res.data;
//   } catch (err) {
//     if (
//       err.response?.status === 500 &&
//       err.response?.data?.includes("No acceptable representation")
//     ) {
//       return { message: "Product added successfully (handled locally)" };
//     }
//     throw err;
//   }
// };

// export const updateProduct = async (product) => {
//   try {
//     const res = await api.put("/products/update", product);
//     return res.data;
//   } catch (err) {
//     if (
//       err.response?.status === 500 &&
//       err.response?.data?.includes("No acceptable representation")
//     ) {
//       return { message: "Product updated successfully (handled locally)" };
//     }
//     throw err;
//   }
// };

// export const deleteProduct = async (product) => {
//   try {
//     const res = await api.delete("/products/delete", {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: JSON.stringify(product),
//     });
//     return res.data;
//   } catch (err) {
//     if (
//       err.response?.status === 500 &&
//       err.response?.data?.includes("No acceptable representation")
//     ) {
//       return { message: "Product deleted successfully (handled locally)" };
//     }
//     throw err;
//   }
// };





import api from "./api";

// Fetch all products (handles backend pagination)
export const fetchAllProducts = async (page = 0, size = 1000) => {
  const res = await api.get(`/products/find-all?page=${page}&size=${size}`);
  // backend returns { content: [...], totalPages, totalElements, ... }
  return res.data.content; // return only the array
};

// Add a single product
export const addProduct = async (product) => {
  try {
    const res = await api.post("/products/add", product);
    return res.data;
  } catch (err) {
    if (
      err.response?.status === 500 &&
      err.response?.data?.includes("No acceptable representation")
    ) {
      return { message: "Product added successfully (handled locally)" };
    }
    throw err;
  }
};

// Update product
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

// Delete product
export const deleteProduct = async (product) => {
  try {
    const res = await api.delete("/products/delete", {
      headers: { "Content-Type": "application/json" },
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

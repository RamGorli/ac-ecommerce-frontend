import api from "./api";

// ✅ Fetch all products (public)
export const fetchAllProducts = async () => {
  const res = await api.get("/products/find-all");

  const products = res.data.map((p) => {
    if (p.image && Array.isArray(p.image)) {
      // Convert byte array to Base64
      const binary = Uint8Array.from(p.image);
      const base64String = btoa(
        binary.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      p.imageBase64 = `data:image/jpeg;base64,${base64String}`;
    }
    return p;
  });

  return products;
};

// ✅ Add product (admin only)
export const addProduct = async (product) => {
  const res = await api.post("/products/add", product);
  return res.data;
};

// ✅ Update product (admin only)
export const updateProduct = async (product) => {
  const res = await api.put("/products/update", product);
  return res.data;
};

// ✅ Delete product (admin only)
export const deleteProduct = async (product) => {
  const res = await api.delete("/products/delete", { data: product });
  return res.data;
};



// import api from "./api";

// //  Fetch all products (public)
// export const fetchAllProducts = async () => {
//   const res = await api.get("/products/find-all");
//   return res.data;
// };

// //  Add product (admin only)
// export const addProduct = async (product) => {
//   const res = await api.post("/products/add", product);
//   return res.data;
// };

// //  Update product (admin only)
// export const updateProduct = async (product) => {
//   const res = await api.put("/products/update", product);
//   return res.data;
// };

// //  Delete product (admin only)
// export const deleteProduct = async (product) => {
//   const res = await api.delete("/products/delete", { data: product });
//   return res.data;
// };



import api from "./api";

// ✅ Fetch all products (public)
export const fetchAllProducts = async () => {
  const res = await api.get("/products/find-all");
  console.log(products);
  // 🔄 Convert byte[] (from backend) → Base64 string
  const products = res.data.map((p) => {
    if (p.image && Array.isArray(p.image)) {
      try {
        const binary = Uint8Array.from(p.image);
        let base64 = "";
        for (let i = 0; i < binary.length; i++) {
          base64 += String.fromCharCode(binary[i]);
        }
        p.imageBase64 = `data:image/jpeg;base64,${btoa(base64)}`;
      } catch (err) {
        console.error("Error converting image for product:", p.id, err);
      }
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



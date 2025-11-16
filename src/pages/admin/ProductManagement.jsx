
// import { useEffect, useState, useMemo, useCallback } from "react";
// import {
//   fetchAllProducts,
//   fetchProductsByType,
//   fetchProductsLessThan,
//   fetchProductsGreaterThan,
//   addProduct,
//   updateProduct,
//   deleteProduct,
// } from "../../services/productApi";

// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const h = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(h);
//   }, [value, delay]);
//   return debouncedValue;
// };

// const pageSize = 8;

// const ProductManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);

//   // Filters
//   const [filterType, setFilterType] = useState("");
//   const [filterPrice, setFilterPrice] = useState("");
//   const [priceFilterType, setPriceFilterType] = useState("less");
//   const debouncedPrice = useDebounce(filterPrice, 300);

//   // Form
//   const [form, setForm] = useState({
//     id: null,
//     name: "",
//     type: "",
//     price: "",
//     description: "",
//     brand: "",
//     capacity: "",
//     imageUrl: "",
//   });

//   const [imageFile, setImageFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const productTypes = useMemo(() => {
//     return [...new Set(products.map((p) => p.type).filter(Boolean))].sort();
//   }, [products]);

//   const loadData = useCallback(
//     async (page = 0, append = false) => {
//       setLoading(true);
//       try {
//         let data = [];

//         if (filterType) {
//           data = await fetchProductsByType(filterType, page, pageSize);
//         } else if (debouncedPrice) {
//           const price = Number(debouncedPrice);
//           if (!isNaN(price)) {
//             data =
//               priceFilterType === "less"
//                 ? await fetchProductsLessThan(price, page, pageSize)
//                 : await fetchProductsGreaterThan(price, page, pageSize);
//           } else data = [];
//         } else {
//           data = await fetchAllProducts(page, pageSize);
//         }

//         const mapped = data.map((p) => ({
//           ...p,
//           imageBase64: p.imageUrl || null,
//         }));

//         setProducts((prev) => (append ? [...prev, ...mapped] : mapped));
//         setHasMore(data.length === pageSize);
//       } catch (err) {
//         console.error("Failed to load products:", err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [filterType, debouncedPrice, priceFilterType]
//   );

//   useEffect(() => {
//     setCurrentPage(0);
//     loadData(0, false);
//   }, [loadData]);

//   const handleLoadMore = () => {
//     if (!hasMore) return;
//     const next = currentPage + 1;
//     setCurrentPage(next);
//     loadData(next, true);
//   };

//   // ------------------------ IMAGE HANDLERS -------------------------
//   const handleImageFile = (file) => {
//     setImageFile(file);
//     if (file) setPreview(URL.createObjectURL(file));
//   };

//   const handleImageUrlChange = (value) => {
//     setImageFile(null);
//     setForm((f) => ({ ...f, imageUrl: value }));
//     setPreview(value);
//   };

//   // ----------------------- SUBMIT FORM (FormData) ------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const fd = new FormData();

//       if (form.id) fd.append("id", form.id);

//       fd.append("name", form.name);
//       fd.append("type", form.type);
//       fd.append("brand", form.brand);
//       fd.append("capacity", form.capacity);
//       fd.append("price", form.price);
//       fd.append("description", form.description);

//       if (imageFile) {
//         fd.append("imageFile", imageFile);
//       } else if (form.imageUrl) {
//         fd.append("imageUrl", form.imageUrl);
//       }

//       if (isEditing) {
//         await updateProduct(fd);
//         alert("Product updated!");
//       } else {
//         await addProduct(fd);
//         alert("Product added!");
//       }

//       // reset form
//       setForm({
//         id: null,
//         name: "",
//         type: "",
//         price: "",
//         description: "",
//         brand: "",
//         capacity: "",
//         imageUrl: "",
//       });
//       setImageFile(null);
//       setPreview(null);
//       setIsEditing(false);

//       // reload products
//       setProducts([]);
//       setCurrentPage(0);
//       setHasMore(true);
//       loadData(0, false);
//     } catch (err) {
//       console.error("Save failed:", err);
//       alert("Failed to save product.");
//     }
//   };

//   const handleEdit = (p) => {
//     setForm({
//       id: p.id,
//       name: p.name || "",
//       type: p.type || "",
//       price: p.price || "",
//       description: p.description || "",
//       brand: p.brand || "",
//       capacity: p.capacity || "",
//       imageUrl: p.imageUrl || "",
//     });

//     setImageFile(null);
//     setPreview(p.imageUrl || null);
//     setIsEditing(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (p) => {
//     if (!window.confirm("Delete this product?")) return;
//     try {
//       await deleteProduct(p);
//       alert("Deleted!");

//       setProducts([]);
//       setCurrentPage(0);
//       setHasMore(true);
//       loadData(0, false);
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert("Failed to delete.");
//     }
//   };

//   const resetFilters = () => {
//     setFilterType("");
//     setFilterPrice("");
//     setPriceFilterType("less");
//     setProducts([]);
//     setCurrentPage(0);
//     setHasMore(true);
//     loadData(0, false);
//   };

//   if (!products.length && loading)
//     return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
//       {/* FORM */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded-xl p-6 mb-10 max-w-3xl mx-auto"
//       >
//         <h3 className="text-2xl font-semibold text-blue-700 mb-4">
//           {isEditing ? "Edit Product" : "Add Product"}
//         </h3>

//         <div className="grid sm:grid-cols-2 gap-4">
//           <input
//             required
//             className="border p-2 rounded-lg"
//             placeholder="Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />

//           <input
//             required
//             className="border p-2 rounded-lg"
//             placeholder="Type"
//             value={form.type}
//             onChange={(e) => setForm({ ...form, type: e.target.value })}
//           />

//           <input
//             className="border p-2 rounded-lg"
//             placeholder="Brand"
//             value={form.brand}
//             onChange={(e) => setForm({ ...form, brand: e.target.value })}
//           />

//           <input
//             className="border p-2 rounded-lg"
//             placeholder="Capacity"
//             value={form.capacity}
//             onChange={(e) => setForm({ ...form, capacity: e.target.value })}
//           />

//           <input
//             required
//             className="border p-2 rounded-lg"
//             type="number"
//             placeholder="Price"
//             value={form.price}
//             onChange={(e) => setForm({ ...form, price: e.target.value })}
//           />

//           {/* IMAGE URL */}
//           <input
//             className="border p-2 rounded-lg sm:col-span-2"
//             placeholder="Image URL (optional)"
//             value={form.imageUrl}
//             onChange={(e) => handleImageUrlChange(e.target.value)}
//           />

//           {/* IMAGE FILE */}
//           <input
//             type="file"
//             accept="image/*"
//             className="border p-2 rounded-lg sm:col-span-2"
//             onChange={(e) => handleImageFile(e.target.files[0])}
//           />

//           <textarea
//             className="border p-2 rounded-lg sm:col-span-2"
//             placeholder="Description"
//             value={form.description}
//             onChange={(e) =>
//               setForm({ ...form, description: e.target.value })
//             }
//           />
//         </div>

//         {preview && (
//           <img
//             src={preview}
//             alt="Preview"
//             className="w-32 h-32 object-cover rounded-lg mt-3"
//           />
//         )}

//         <button className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg">
//           {isEditing ? "Update Product" : "Add Product"}
//         </button>
//       </form>

//       {/* FILTERS */}
//       <div className="flex flex-wrap justify-center gap-4 mb-8">
//         <select
//           className="border px-3 py-2 rounded-lg"
//           value={filterType}
//           onChange={(e) => {
//             setFilterType(e.target.value);
//             setProducts([]);
//             setCurrentPage(0);
//             setHasMore(true);
//           }}
//         >
//           <option value="">All Types</option>
//           {productTypes.map((t) => (
//             <option key={t}>{t}</option>
//           ))}
//         </select>

//         <input
//           type="number"
//           className="border px-3 py-2 w-24 rounded-lg"
//           placeholder="Price"
//           value={filterPrice}
//           onChange={(e) => {
//             setFilterPrice(e.target.value);
//             setProducts([]);
//             setCurrentPage(0);
//             setHasMore(true);
//           }}
//         />

//         <select
//           className="border px-3 py-2 rounded-lg"
//           value={priceFilterType}
//           onChange={(e) => {
//             setPriceFilterType(e.target.value);
//             setProducts([]);
//             setCurrentPage(0);
//             setHasMore(true);
//           }}
//         >
//           <option value="less">≤ Price</option>
//           <option value="greater">≥ Price</option>
//         </select>

//         <button onClick={resetFilters} className="border px-4 py-2 rounded-lg">
//           Reset
//         </button>
//       </div>

//       {/* PRODUCT GRID */}
//       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {products.map((p) => (
//           <div
//             key={p.id}
//             className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
//           >
//             {p.imageBase64 ? (
//               <img
//                 src={p.imageBase64}
//                 alt={p.name}
//                 className="w-full h-48 object-cover rounded-lg"
//               />
//             ) : (
//               <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
//                 No Image
//               </div>
//             )}

//             <h4 className="font-bold mt-2">{p.brand}</h4>
//             <h3 className="font-semibold">{p.name}</h3>
//             <p className="text-sm">{p.type} • {p.capacity}</p>
//             <p className="text-blue-700 font-semibold mt-1">AUD ${p.price}</p>

//             <p className="text-gray-500 text-sm mt-2">{p.description}</p>

//             <div className="flex gap-2 mt-3">
//               <button
//                 onClick={() => handleEdit(p)}
//                 className="bg-green-500 text-white px-3 py-1 rounded-lg"
//               >
//                 Edit
//               </button>

//               <button
//                 onClick={() => handleDelete(p)}
//                 className="bg-red-500 text-white px-3 py-1 rounded-lg"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {hasMore && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handleLoadMore}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             {loading ? "Loading..." : "Show More"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductManagement;







// src/components/ProductManagement/ProductManagement.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  fetchAllProducts,
  fetchProductsByType,
  fetchProductsLessThan,
  fetchProductsGreaterThan,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productApi";

/**
 * ProductManagement (single-file refactor)
 *
 * - Removed imageUrl completely (no input, never sent to backend)
 * - Form accepts only an image FILE (optional)
 * - Filters, ProductGrid, and ProductForm are separated and memoized to avoid full-page re-renders
 * - Uses debounced price input for network calls
 * - Pagination + filtering work together
 */

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const h = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return debouncedValue;
};

const pageSize = 8;

/* ----------------------------- Filters ----------------------------- */
const Filters = React.memo(function Filters({
  filterType,
  setFilterType,
  filterPrice,
  setFilterPrice,
  priceFilterType,
  setPriceFilterType,
  resetFilters,
  productTypes,
}) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
      <select
        className="border px-3 py-2 rounded-lg"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="">All Types</option>
        {productTypes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Price"
        className="border px-3 py-2 w-24 rounded-lg"
        value={filterPrice}
        onChange={(e) => setFilterPrice(e.target.value)}
      />

      <select
        className="border px-3 py-2 rounded-lg"
        value={priceFilterType}
        onChange={(e) => setPriceFilterType(e.target.value)}
      >
        <option value="less">≤ Price</option>
        <option value="greater">≥ Price</option>
      </select>

      <button onClick={resetFilters} className="border px-4 py-2 rounded-lg">
        Reset
      </button>
    </div>
  );
});

/* ---------------------------- ProductGrid -------------------------- */
const ProductGrid = React.memo(function ProductGrid({
  products,
  onEdit,
  onDelete,
  loading,
  handleLoadMore,
  hasMore,
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            {p.imageBase64 ? (
              <img
                src={p.imageBase64}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                No Image
              </div>
            )}

            <h4 className="font-bold mt-2">{p.brand || "Unknown Brand"}</h4>
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm">
              {p.type} • {p.capacity || "N/A"}
            </p>
            <p className="text-blue-700 font-semibold mt-1">AUD ${p.price}</p>

            <p className="text-gray-500 text-sm mt-2">{p.description}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onEdit(p)}
                className="bg-green-500 text-white px-3 py-1 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(p)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <p className="text-center mt-10 text-gray-700 text-lg">
          Loading products...
        </p>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
});

/* ---------------------------- ProductForm -------------------------- */
const ProductForm = React.memo(function ProductForm({
  onSaveSuccess,
  onCancelEdit,
  editingProduct,
  onSubmitCreateOrUpdate,
}) {
  // Local form state (only what the form needs)
  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "",
    price: "",
    description: "",
    brand: "",
    capacity: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // populate when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setForm({
        id: editingProduct.id,
        name: editingProduct.name || "",
        type: editingProduct.type || "",
        price: editingProduct.price || "",
        description: editingProduct.description || "",
        brand: editingProduct.brand || "",
        capacity: editingProduct.capacity || "",
      });
      setPreview(editingProduct.imageBase64 || null);
      setImageFile(null);
      setIsEditing(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // reset
      setForm({
        id: null,
        name: "",
        type: "",
        price: "",
        description: "",
        brand: "",
        capacity: "",
      });
      setImageFile(null);
      setPreview(null);
      setIsEditing(false);
    }
  }, [editingProduct]);

  // cleanup preview object URLs
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageFile = (file) => {
    setImageFile(file);
    if (file) {
      const u = URL.createObjectURL(file);
      setPreview(u);
    } else {
      setPreview(null);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (form.id) fd.append("id", form.id);
      fd.append("name", form.name);
      fd.append("type", form.type);
      fd.append("brand", form.brand);
      fd.append("capacity", form.capacity);
      fd.append("price", form.price);
      fd.append("description", form.description);

      // NOTE: we only send imageFile if the user selected a file.
      // We DO NOT send any imageUrl.
      if (imageFile) {
        fd.append("imageFile", imageFile);
      }

      await onSubmitCreateOrUpdate(fd, isEditing);

      // success actions
      setForm({
        id: null,
        name: "",
        type: "",
        price: "",
        description: "",
        brand: "",
        capacity: "",
      });
      setImageFile(null);
      setPreview(null);
      setIsEditing(false);
      onSaveSuccess && onSaveSuccess();
      alert(isEditing ? "Product updated!" : "Product added!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white shadow-md rounded-xl p-6 mb-10 max-w-3xl mx-auto"
    >
      <h3 className="text-2xl font-semibold text-blue-700 mb-4">
        {isEditing ? "Edit Product" : "Add Product"}
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          required
          className="border p-2 rounded-lg"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />

        <input
          required
          className="border p-2 rounded-lg"
          placeholder="Type"
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
        />

        <input
          className="border p-2 rounded-lg"
          placeholder="Brand"
          value={form.brand}
          onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
        />

        <input
          className="border p-2 rounded-lg"
          placeholder="Capacity"
          value={form.capacity}
          onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
        />

        <input
          required
          className="border p-2 rounded-lg"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        />

        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded-lg sm:col-span-2"
          onChange={(e) =>
            handleImageFile(e.target.files && e.target.files.length ? e.target.files[0] : null)
          }
        />

        <textarea
          className="border p-2 rounded-lg sm:col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>

      {preview && (
        <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mt-3" />
      )}

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          disabled={saving}
        >
          {saving ? (isEditing ? "Updating..." : "Saving...") : isEditing ? "Update Product" : "Add Product"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              onCancelEdit && onCancelEdit();
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
});

/* ------------------------- Parent Component ------------------------ */
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [priceFilterType, setPriceFilterType] = useState("less");
  const debouncedPrice = useDebounce(filterPrice, 300);

  // Editing
  const [editingProduct, setEditingProduct] = useState(null);

  // Keep a stable ref of last applied filters to prevent extra loads
  const loadData = useCallback(
    async (page = 0, append = false) => {
      setLoading(true);
      try {
        let data = [];

        if (filterType) {
          data = await fetchProductsByType(filterType, page, pageSize);
        } else if (debouncedPrice) {
          const price = Number(debouncedPrice);
          if (!isNaN(price)) {
            data =
              priceFilterType === "less"
                ? await fetchProductsLessThan(price, page, pageSize)
                : await fetchProductsGreaterThan(price, page, pageSize);
          } else {
            data = [];
          }
        } else {
          data = await fetchAllProducts(page, pageSize);
        }

        const mapped = (data || []).map((p) => ({
          ...p,
          imageBase64: p.imageUrl || null, // backend still may return imageUrl
        }));

        setProducts((prev) => (append ? [...prev, ...mapped] : mapped));
        setHasMore((data || []).length === pageSize);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    },
    [filterType, debouncedPrice, priceFilterType]
  );

  // initial + filter changes
  useEffect(() => {
    setCurrentPage(0);
    loadData(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore) return;
    const next = currentPage + 1;
    setCurrentPage(next);
    loadData(next, true);
  }, [currentPage, hasMore, loadData]);

  // derive product types from the currently loaded products (memoized)
  const productTypes = useMemo(() => {
    const set = new Set();
    for (const p of products) if (p.type) set.add(p.type);
    return [...set].sort();
  }, [products]);

  const resetFilters = useCallback(() => {
    setFilterType("");
    setFilterPrice("");
    setPriceFilterType("less");
    setCurrentPage(0);
    loadData(0, false);
  }, [loadData]);

  const handleEdit = useCallback((p) => {
    setEditingProduct(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingProduct(null);
  }, []);

  const handleDelete = useCallback(
    async (p) => {
      if (!window.confirm("Delete this product?")) return;
      try {
        await deleteProduct(p);
        alert("Deleted!");
        // refresh
        setProducts([]);
        setCurrentPage(0);
        setHasMore(true);
        loadData(0, false);
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete.");
      }
    },
    [loadData]
  );

  const handleSubmitCreateOrUpdate = useCallback(
    async (formData, isEditing) => {
      // formData is FormData from ProductForm
      if (isEditing) {
        await updateProduct(formData);
      } else {
        await addProduct(formData);
      }
      // reload list after create/update
      setProducts([]);
      setCurrentPage(0);
      setHasMore(true);
      await loadData(0, false);
      setEditingProduct(null);
    },
    [loadData]
  );

  // small loading placeholder
  if (!products.length && loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <ProductForm
        onSaveSuccess={() => {
          /* parent can react if needed */
        }}
        onCancelEdit={handleCancelEdit}
        editingProduct={editingProduct}
        onSubmitCreateOrUpdate={handleSubmitCreateOrUpdate}
      />

      {/* Filters always visible */}
      <Filters
        filterType={filterType}
        setFilterType={(val) => {
          setFilterType(val);
          setProducts([]);
          setCurrentPage(0);
          setHasMore(true);
        }}
        filterPrice={filterPrice}
        setFilterPrice={(val) => {
          setFilterPrice(val);
          setProducts([]);
          setCurrentPage(0);
          setHasMore(true);
        }}
        priceFilterType={priceFilterType}
        setPriceFilterType={(val) => {
          setPriceFilterType(val);
          setProducts([]);
          setCurrentPage(0);
          setHasMore(true);
        }}
        resetFilters={resetFilters}
        productTypes={productTypes}
      />

      {/* Product Grid */}
      <ProductGrid
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        handleLoadMore={handleLoadMore}
        hasMore={hasMore}
      />
    </div>
  );
};

export default ProductManagement;

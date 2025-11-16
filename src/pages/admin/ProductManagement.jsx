
// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import {
//   fetchAllProducts,
//   fetchProductsByType,
//   fetchProductsLessThan,
//   fetchProductsGreaterThan,
//   addProduct,
//   updateProduct,
//   deleteProduct,
// } from "../../services/productApi";

// /* --------------------------- Debounce Hook --------------------------- */
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const id = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(id);
//   }, [value, delay]);

//   return debouncedValue;
// };

// const pageSize = 8;

// /* ----------------------------- Filters ----------------------------- */
// const Filters = React.memo(function Filters({
//   filterType,
//   setFilterType,
//   filterPrice,
//   setFilterPrice,
//   priceFilterType,
//   setPriceFilterType,
//   resetFilters,
//   productTypes,
// }) {
//   return (
//     <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
//       <select
//         className="border px-3 py-2 rounded-lg"
//         value={filterType}
//         onChange={(e) => setFilterType(e.target.value)}
//       >
//         <option value="">All Types</option>
//         {productTypes.map((t) => (
//           <option key={t} value={t}>
//             {t}
//           </option>
//         ))}
//       </select>

//       <input
//         type="number"
//         placeholder="Price"
//         className="border px-3 py-2 w-24 rounded-lg"
//         value={filterPrice}
//         onChange={(e) => setFilterPrice(e.target.value)}
//       />

//       <select
//         className="border px-3 py-2 rounded-lg"
//         value={priceFilterType}
//         onChange={(e) => setPriceFilterType(e.target.value)}
//       >
//         <option value="less">Lesser</option>
//         <option value="greater">Greater</option>
//       </select>

//       <button onClick={resetFilters} className="border px-4 py-2 rounded-lg">
//         Reset
//       </button>
//     </div>
//   );
// });

// /* ---------------------------- ProductGrid -------------------------- */
// const ProductGrid = React.memo(function ProductGrid({
//   products,
//   onEdit,
//   onDelete,
//   loading,
//   handleLoadMore,
//   hasMore,
// }) {
//   return (
//     <>
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

//             <h4 className="font-bold mt-2">{p.brand || "Unknown Brand"}</h4>
//             <h3 className="font-semibold">{p.name}</h3>
//             <p className="text-sm">
//               {p.type} • {p.capacity || "N/A"}
//             </p>
//             <p className="text-blue-700 font-semibold mt-1">AUD ${p.price}</p>

//             <p className="text-gray-500 text-sm mt-2">{p.description}</p>

//             <div className="flex gap-2 mt-3">
//               <button
//                 onClick={() => onEdit(p)}
//                 className="bg-green-500 text-white px-3 py-1 rounded-lg"
//               >
//                 Edit
//               </button>

//               <button
//                 onClick={() => onDelete(p)}
//                 className="bg-red-500 text-white px-3 py-1 rounded-lg"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {loading && (
//         <p className="text-center mt-10 text-gray-700 text-lg">
//           Loading products...
//         </p>
//       )}

//       {hasMore && !loading && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handleLoadMore}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             Show More
//           </button>
//         </div>
//       )}
//     </>
//   );
// });

// /* ---------------------------- ProductForm -------------------------- */
// const ProductForm = React.memo(function ProductForm({
//   onSaveSuccess,
//   onCancelEdit,
//   editingProduct,
//   onSubmitCreateOrUpdate,
// }) {
//   const [form, setForm] = useState({
//     id: null,
//     name: "",
//     type: "",
//     price: "",
//     description: "",
//     brand: "",
//     capacity: "",
//   });
//   const [imageFile, setImageFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (editingProduct) {
//       setForm({
//         id: editingProduct.id,
//         name: editingProduct.name || "",
//         type: editingProduct.type || "",
//         price: editingProduct.price || "",
//         description: editingProduct.description || "",
//         brand: editingProduct.brand || "",
//         capacity: editingProduct.capacity || "",
//       });
//       setPreview(editingProduct.imageBase64 || null);
//       setImageFile(null);
//       setIsEditing(true);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } else {
//       setForm({
//         id: null,
//         name: "",
//         type: "",
//         price: "",
//         description: "",
//         brand: "",
//         capacity: "",
//       });
//       setImageFile(null);
//       setPreview(null);
//       setIsEditing(false);
//     }
//   }, [editingProduct]);

//   const handleImageFile = (file) => {
//     setImageFile(file);
//     if (file) {
//       setPreview(URL.createObjectURL(file));
//     } else {
//       setPreview(null);
//     }
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

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
//       }

//       await onSubmitCreateOrUpdate(fd, isEditing);

//       setForm({
//         id: null,
//         name: "",
//         type: "",
//         price: "",
//         description: "",
//         brand: "",
//         capacity: "",
//       });
//       setImageFile(null);
//       setPreview(null);
//       setIsEditing(false);

//       onSaveSuccess && onSaveSuccess();
//       alert(isEditing ? "Product updated!" : "Product added!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save product.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={submit}
//       className="bg-white shadow-md rounded-xl p-6 mb-10 max-w-3xl mx-auto"
//     >
//       <h3 className="text-2xl font-semibold text-blue-700 mb-4">
//         {isEditing ? "Edit Product" : "Add Product"}
//       </h3>

//       <div className="grid sm:grid-cols-2 gap-4">
//         <input
//           required
//           className="border p-2 rounded-lg"
//           placeholder="Name"
//           value={form.name}
//           onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//         />

//         <input
//           required
//           className="border p-2 rounded-lg"
//           placeholder="Type"
//           value={form.type}
//           onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
//         />

//         <input
//           className="border p-2 rounded-lg"
//           placeholder="Brand"
//           value={form.brand}
//           onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
//         />

//         <input
//           className="border p-2 rounded-lg"
//           placeholder="Capacity"
//           value={form.capacity}
//           onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
//         />

//         <input
//           required
//           className="border p-2 rounded-lg"
//           type="number"
//           placeholder="Price"
//           value={form.price}
//           onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
//         />

//         <input
//           type="file"
//           accept="image/*"
//           className="border p-2 rounded-lg sm:col-span-2"
//           onChange={(e) =>
//             handleImageFile(e.target.files?.[0] || null)
//           }
//         />

//         <textarea
//           className="border p-2 rounded-lg sm:col-span-2"
//           placeholder="Description"
//           value={form.description}
//           onChange={(e) =>
//             setForm((f) => ({ ...f, description: e.target.value }))
//           }
//         />
//       </div>

//       {preview && (
//         <img
//           src={preview}
//           alt="Preview"
//           className="w-32 h-32 object-cover rounded-lg mt-3"
//         />
//       )}

//       <div className="flex gap-3 mt-5">
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg"
//           disabled={saving}
//         >
//           {saving ? (isEditing ? "Updating..." : "Saving...") : isEditing ? "Update Product" : "Add Product"}
//         </button>

//         {isEditing && (
//           <button
//             type="button"
//             onClick={onCancelEdit}
//             className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
//             disabled={saving}
//           >
//             Cancel
//           </button>
//         )}
//       </div>
//     </form>
//   );
// });

// /* ------------------------- Parent Component ------------------------ */
// const ProductManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);

//   const [filterType, setFilterType] = useState("");
//   const [filterPrice, setFilterPrice] = useState("");
//   const [priceFilterType, setPriceFilterType] = useState("less");
//   const debouncedPrice = useDebounce(filterPrice, 300);

//   const [editingProduct, setEditingProduct] = useState(null);

//   /* --------------------- Load Data with Filters --------------------- */
//   const loadData = useCallback(
//     async (page = 0, append = false) => {
//       setLoading(true);

//       try {
//         let data = [];

//         if (filterType) {
//           data = await fetchProductsByType(filterType, page, pageSize);
//         } else if (debouncedPrice) {
//           const price = Number(debouncedPrice);

//           data =
//             priceFilterType === "less"
//               ? await fetchProductsLessThan(price, page, pageSize)
//               : await fetchProductsGreaterThan(price, page, pageSize);
//         } else {
//           data = await fetchAllProducts(page, pageSize);
//         }

//         const mapped = (data || []).map((p) => ({
//           ...p,
//           imageBase64: p.imageUrl || null,
//         }));

//         setProducts((prev) => (append ? [...prev, ...mapped] : mapped));
//         setHasMore(mapped.length === pageSize);
//       } catch (err) {
//         console.error(err);
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

//   const handleLoadMore = useCallback(() => {
//     if (!hasMore) return;
//     const next = currentPage + 1;
//     setCurrentPage(next);
//     loadData(next, true);
//   }, [currentPage, hasMore, loadData]);

//   const productTypes = useMemo(() => {
//     const set = new Set();
//     for (const p of products) if (p.type) set.add(p.type);
//     return [...set].sort();
//   }, [products]);

//   const resetFilters = () => {
//     setFilterType("");
//     setFilterPrice("");
//     setPriceFilterType("less");
//   };

//   const handleEdit = (p) => setEditingProduct(p);
//   const handleCancelEdit = () => setEditingProduct(null);

//   const handleDelete = async (p) => {
//     if (!window.confirm("Delete this product?")) return;

//     try {
//       await deleteProduct(p);
//       alert("Deleted!");
//       loadData(0, false);
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     }
//   };

//   const handleSubmitCreateOrUpdate = async (formData, isEditing) => {
//     if (isEditing) await updateProduct(formData);
//     else await addProduct(formData);

//     setEditingProduct(null);
//     loadData(0, false);
//   };

//   return (
//     <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
//       <ProductForm
//         onSaveSuccess={() => {}}
//         onCancelEdit={handleCancelEdit}
//         editingProduct={editingProduct}
//         onSubmitCreateOrUpdate={handleSubmitCreateOrUpdate}
//       />

//       <Filters
//         filterType={filterType}
//         setFilterType={(v) => {
//           setFilterType(v);
//           setProducts([]);
//           setCurrentPage(0);
//         }}
//         filterPrice={filterPrice}
//         setFilterPrice={(v) => {
//           setFilterPrice(v);
//           setProducts([]);
//           setCurrentPage(0);
//         }}
//         priceFilterType={priceFilterType}
//         setPriceFilterType={(v) => {
//           setPriceFilterType(v);
//           setProducts([]);
//           setCurrentPage(0);
//         }}
//         resetFilters={resetFilters}
//         productTypes={productTypes}
//       />

//       <ProductGrid
//         products={products}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         loading={loading}
//         handleLoadMore={handleLoadMore}
//         hasMore={hasMore}
//       />
//     </div>
//   );
// };

// export default ProductManagement;




import React, { useEffect, useState, useCallback } from "react";
import {
  fetchFilteredProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchDropdownData,
} from "../../services/productApi";

/* --------------------------- Debounce Hook --------------------------- */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debouncedValue;
};

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
  brands,
  capacities,
  filterBrand,
  setFilterBrand,
  filterCapacity,
  setFilterCapacity,
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

      <select
        className="border px-3 py-2 rounded-lg"
        value={filterBrand}
        onChange={(e) => setFilterBrand(e.target.value)}
      >
        <option value="">All Brands</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <select
        className="border px-3 py-2 rounded-lg"
        value={filterCapacity}
        onChange={(e) => setFilterCapacity(e.target.value)}
      >
        <option value="">All Capacities</option>
        {capacities.map((c) => (
          <option key={c} value={c}>
            {c}
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
        <option value="less">Lesser</option>
        <option value="greater">Greater</option>
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
            {p.imageUrl ? (
              <img
                src={p.imageUrl}
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
      setPreview(editingProduct.imageUrl || null);
      setImageFile(null);
      setIsEditing(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
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

  const handleImageFile = (file) => {
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
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

      if (imageFile) fd.append("imageFile", imageFile);

      await onSubmitCreateOrUpdate(fd, isEditing);

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
      console.error(err);
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
          onChange={(e) => handleImageFile(e.target.files?.[0] || null)}
        />

        <textarea
          className="border p-2 rounded-lg sm:col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
      </div>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg mt-3"
        />
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
            onClick={onCancelEdit}
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
  const [filterBrand, setFilterBrand] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [priceFilterType, setPriceFilterType] = useState("less");
  const debouncedPrice = useDebounce(filterPrice, 300);

  // Dropdown options from backend
  const [productTypes, setProductTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [capacities, setCapacities] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);

  /* --------------------- Load Dropdown Data --------------------- */
  useEffect(() => {
    const loadDropdown = async () => {
      try {
        const data = await fetchDropdownData();
        setProductTypes(data.types || []);
        setBrands(data.brands || []);
        setCapacities(data.capacities || []);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };
    loadDropdown();
  }, []);

  /* --------------------- Load Products --------------------- */
  const loadData = useCallback(
    async (page = 0, append = false) => {
      setLoading(true);

      try {
        const data = await fetchFilteredProducts({
          type: filterType,
          brand: filterBrand,
          capacity: filterCapacity,
          minPrice: priceFilterType === "greater" ? Number(debouncedPrice) : "",
          maxPrice: priceFilterType === "less" ? Number(debouncedPrice) : "",
          page,
          size: 8,
        });

        const mapped = (data.content || []).map((p) => ({
          ...p,
          imageUrl: p.imageUrl || null,
        }));

        setProducts((prev) => (append ? [...prev, ...mapped] : mapped));
        setHasMore(mapped.length === 8);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filterType, filterBrand, filterCapacity, debouncedPrice, priceFilterType]
  );

  useEffect(() => {
    setCurrentPage(0);
    loadData(0, false);
  }, [loadData]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore) return;
    const next = currentPage + 1;
    setCurrentPage(next);
    loadData(next, true);
  }, [currentPage, hasMore, loadData]);

  const resetFilters = () => {
    setFilterType("");
    setFilterBrand("");
    setFilterCapacity("");
    setFilterPrice("");
    setPriceFilterType("less");
  };

  const handleEdit = (p) => setEditingProduct(p);
  const handleCancelEdit = () => setEditingProduct(null);

  const handleDelete = async (p) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(p);
      alert("Deleted!");
      loadData(0, false);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleSubmitCreateOrUpdate = async (formData, isEditing) => {
    if (isEditing) await updateProduct(formData);
    else await addProduct(formData);

    setEditingProduct(null);
    loadData(0, false);
  };

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <ProductForm
        onSaveSuccess={() => {}}
        onCancelEdit={handleCancelEdit}
        editingProduct={editingProduct}
        onSubmitCreateOrUpdate={handleSubmitCreateOrUpdate}
      />

      <Filters
        filterType={filterType}
        setFilterType={setFilterType}
        filterBrand={filterBrand}
        setFilterBrand={setFilterBrand}
        filterCapacity={filterCapacity}
        setFilterCapacity={setFilterCapacity}
        filterPrice={filterPrice}
        setFilterPrice={setFilterPrice}
        priceFilterType={priceFilterType}
        setPriceFilterType={setPriceFilterType}
        resetFilters={resetFilters}
        productTypes={productTypes}
        brands={brands}
        capacities={capacities}
      />

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

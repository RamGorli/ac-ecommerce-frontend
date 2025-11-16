
// import { useEffect, useState, useMemo, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import {
//   fetchAllProducts,
//   addProduct,
//   updateProduct,
//   deleteProduct,
// } from "../../services/productApi";

// const ProductManagement = () => {
//   const { user } = useContext(AuthContext);

//   const [allProducts, setAllProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);

//   const [filterType, setFilterType] = useState("");
//   const [filterPrice, setFilterPrice] = useState("");
//   const [priceFilterType, setPriceFilterType] = useState("less");

//   const pageSize = 9;

//   const [form, setForm] = useState({
//     id: null,
//     name: "",
//     type: "",
//     price: "",
//     description: "",
//     image: null,
//   });
//   const [preview, setPreview] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   // Load products page
//   const loadProducts = async (page) => {
//     setLoading(true);
//     try {
//       const data = await fetchAllProducts(page, pageSize);

//       const converted = data.map((p) => {
//         let imageBase64 = null;
//         if (p.image && Array.isArray(p.image)) {
//           const binary = Uint8Array.from(p.image);
//           let base64 = "";
//           for (let i = 0; i < binary.length; i++) base64 += String.fromCharCode(binary[i]);
//           imageBase64 = `data:image/jpeg;base64,${btoa(base64)}`;
//         } else if (typeof p.image === "string" && !p.image.startsWith("data:")) {
//           imageBase64 = `data:image/jpeg;base64,${p.image}`;
//         }
//         return { ...p, imageBase64 };
//       });

//       setAllProducts((prev) => [...prev, ...converted]);
//       if (data.length < pageSize) setHasMore(false);
//     } catch (err) {
//       console.error("Failed to fetch products:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts(currentPage);
//   }, [currentPage]);

//   // Filtered products
//   useEffect(() => {
//     let result = [...allProducts];
//     if (filterType) result = result.filter((p) => p.type === filterType);
//     if (filterPrice.trim() !== "") {
//       const price = parseFloat(filterPrice);
//       if (!isNaN(price)) {
//         result = priceFilterType === "less"
//           ? result.filter((p) => p.price <= price)
//           : result.filter((p) => p.price >= price);
//       }
//     }
//     setFilteredProducts(result);
//   }, [allProducts, filterType, filterPrice, priceFilterType]);

//   const productTypes = useMemo(
//     () => [...new Set(allProducts.map((p) => p.type))].sort(),
//     [allProducts]
//   );

//   const resetFilters = () => {
//     setFilterType("");
//     setFilterPrice("");
//     setPriceFilterType("less");
//   };

//   const handleLoadMore = () => {
//     if (hasMore) setCurrentPage((prev) => prev + 1);
//   };

//   // --- Form Handlers ---
//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       const base64 = reader.result.split(",")[1];
//       setForm({ ...form, image: base64 });
//       setPreview(URL.createObjectURL(file));
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user?.roles?.includes("ROLE_ADMIN")) return alert("Only admins can modify products!");

//     const payload = {
//       ...form,
//       price: parseFloat(form.price),
//     };

//     try {
//       if (isEditing) {
//         await updateProduct(payload);
//         alert("Product updated!");
//       } else {
//         await addProduct(payload);
//         alert("Product added!");
//       }
//       setForm({ id: null, name: "", type: "", price: "", description: "", image: null });
//       setPreview(null);
//       setIsEditing(false);
//       setAllProducts([]);
//       setCurrentPage(0);
//       setHasMore(true);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save product!");
//     }
//   };

//   const handleEdit = (p) => {
//     setForm({
//       id: p.id,
//       name: p.name,
//       type: p.type,
//       price: p.price,
//       description: p.description || "",
//       image: p.image,
//     });
//     setPreview(p.imageBase64 || null);
//     setIsEditing(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (p) => {
//     if (!window.confirm("Delete this product?")) return;
//     try {
//       await deleteProduct(p);
//       alert("Deleted!");
//       setAllProducts([]);
//       setCurrentPage(0);
//       setHasMore(true);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete product!");
//     }
//   };

//   if (!allProducts.length && loading) return <p className="text-center mt-10">Loading products...</p>;

//   return (
//     <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
//       {/* Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded-xl p-6 mb-10 max-w-3xl mx-auto border border-gray-200"
//       >
//         <h3 className="text-2xl font-semibold text-blue-700 mb-4">{isEditing ? "Edit Product" : "Add Product"}</h3>
//         <div className="grid sm:grid-cols-2 gap-4">
//           <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="border p-2 rounded-lg" />
//           <input type="text" placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required className="border p-2 rounded-lg" />
//           <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="border p-2 rounded-lg" />
//           <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-2 rounded-lg sm:col-span-2" />
//           <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 rounded-lg sm:col-span-2" />
//         </div>
//         {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mt-3" />}
//         <button className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">{isEditing ? "Update Product" : "Add Product"}</button>
//       </form>

//       {/* Filters */}
//       <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
//         <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border px-3 py-2 rounded-lg">
//           <option value="">All Types</option>
//           {productTypes.map((t) => <option key={t} value={t}>{t}</option>)}
//         </select>
//         <input type="number" placeholder="Price" value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)} className="border px-3 py-2 rounded-lg w-24" />
//         <select value={priceFilterType} onChange={(e) => setPriceFilterType(e.target.value)} className="border px-3 py-2 rounded-lg">
//           <option value="less">≤</option>
//           <option value="greater">≥</option>
//         </select>
//         <button onClick={resetFilters} className="border px-4 py-2 rounded-lg">Reset</button>
//       </div>

//       {/* Grid */}
//       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {filteredProducts.map((p) => (
//           <div key={p.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
//             {p.imageBase64 ? <img src={p.imageBase64} alt={p.name} className="w-full h-48 object-cover rounded-lg mb-3" /> : <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 mb-3">No Image</div>}
//             <h4 className="font-semibold text-blue-700">{p.name}</h4>
//             <p className="text-blue-600 font-semibold">₹{p.price}</p>
//             <p className="text-sm text-gray-600">{p.type}</p>
//             <p className="text-gray-500 text-sm mt-1">{p.description}</p>
//             <div className="flex gap-2 mt-3">
//               <button onClick={() => handleEdit(p)} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">Edit</button>
//               <button onClick={() => handleDelete(p)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {hasMore && (
//         <div className="flex justify-center mt-6">
//           <button onClick={handleLoadMore} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{loading ? "Loading..." : "Show More"}</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductManagement;



import { useEffect, useState, useMemo, useCallback } from "react";
import {
  fetchAllProducts,
  fetchProductsByType,
  fetchProductsLessThan,
  fetchProductsGreaterThan,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productApi";

// simple debounce hook (same as ACList)
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const h = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return debouncedValue;
};

const pageSize = 8;

const ProductManagement = () => {
  // Admin state
  const [products, setProducts] = useState([]); // currently displayed (paged) products
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Filters (UI always visible)
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [priceFilterType, setPriceFilterType] = useState("less");
  const debouncedPrice = useDebounce(filterPrice, 300);

  // Form (add / edit)
  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "",
    price: "",
    description: "",
    brand: "",
    capacity: "",
    imageUrl: "",
  });
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // derive product types from loaded products
  const productTypes = useMemo(() => {
    return [...new Set(products.map((p) => p.type).filter(Boolean))].sort();
  }, [products]);

  // central data loader (works for normal and filtered modes)
  const loadData = useCallback(
    async (page = 0, append = false) => {
      setLoading(true);
      try {
        let data = [];

        // Filter precedence: type -> price -> all
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
            data = []; // invalid price -> no results
          }
        } else {
          data = await fetchAllProducts(page, pageSize);
        }

        // Map fields (use imageUrl directly, keep consistent key used in ACList)
        const mapped = data.map((p) => ({
          ...p,
          imageBase64: p.imageUrl || null, // name kept for UI reuse
        }));

        setProducts((prev) => (append ? [...prev, ...mapped] : mapped));
        setHasMore(data.length === pageSize);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    },
    [filterType, debouncedPrice, priceFilterType]
  );

  // initial load & reload when filters change
  useEffect(() => {
    // reset to first page on filter change
    setCurrentPage(0);
    loadData(0, false);
  }, [loadData]);

  // load more handler
  const handleLoadMore = () => {
    if (!hasMore) return;
    const next = currentPage + 1;
    setCurrentPage(next);
    loadData(next, true);
  };

  // --------- Form handlers (Add / Edit / Delete) ----------
  const handleImageUrlChange = (val) => {
    setForm((f) => ({ ...f, imageUrl: val }));
    setPreview(val || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (payload.price && Number.isNaN(payload.price) === false) {
        if (form.id) {
          await updateProduct(payload);
          alert("Product updated!");
        } else {
          await addProduct(payload);
          alert("Product added!");
        }

        // reset form + reload list
        setForm({
          id: null,
          name: "",
          type: "",
          price: "",
          description: "",
          brand: "",
          capacity: "",
          imageUrl: "",
        });
        setPreview(null);
        setIsEditing(false);

        // reset listing to re-fetch from page 0 (applies current filter as well)
        setProducts([]);
        setCurrentPage(0);
        setHasMore(true);
        loadData(0, false);
      } else {
        alert("Please enter a valid price.");
      }
    } catch (err) {
      console.error("Save product failed:", err);
      alert("Failed to save product.");
    }
  };

  const handleEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name || "",
      type: p.type || "",
      price: p.price || "",
      description: p.description || "",
      brand: p.brand || "",
      capacity: p.capacity || "",
      imageUrl: p.imageUrl || "",
    });
    setPreview(p.imageUrl || null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (p) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(p);
      alert("Deleted!");
      // reset and reload
      setProducts([]);
      setCurrentPage(0);
      setHasMore(true);
      loadData(0, false);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product.");
    }
  };

  // Reset filters (keeps UI visible)
  const resetFilters = () => {
    setFilterType("");
    setFilterPrice("");
    setPriceFilterType("less");
    // reload
    setProducts([]);
    setCurrentPage(0);
    setHasMore(true);
    loadData(0, false);
  };

  // show loading at start if no products
  if (!products.length && loading)
    return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-10 max-w-3xl mx-auto border border-gray-200"
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
            placeholder="Type"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          />

          <input
            required
            className="border p-2 rounded-lg"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />

          <input
            className="border p-2 rounded-lg sm:col-span-2"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => handleImageUrlChange(e.target.value)}
          />

          <textarea
            className="border p-2 rounded-lg sm:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg mt-3"
          />
        )}

        <button className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Filters — ALWAYS VISIBLE (ACList style) */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        <select
          className="border px-3 py-2 rounded-lg"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            // reset listing when type changes
            setProducts([]);
            setCurrentPage(0);
            setHasMore(true);
            // loadData will be triggered by effect (debounced filter)
          }}
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
          onChange={(e) => {
            setFilterPrice(e.target.value);
            // reset listing while typing
            setProducts([]);
            setCurrentPage(0);
            setHasMore(true);
          }}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          value={priceFilterType}
          onChange={(e) => {
            setPriceFilterType(e.target.value);
            setProducts([]);
            setCurrentPage(0);
            setHasMore(true);
          }}
        >
          <option value="less">≤ Price</option>
          <option value="greater">≥ Price</option>
        </select>

        <button onClick={resetFilters} className="border px-4 py-2 rounded-lg">
          Reset
        </button>
      </div>

      {/* Product Grid (ACList style) */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-default group"
          >
            {p.imageBase64 ? (
              <img
                src={p.imageBase64}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-95"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                No Image
              </div>
            )}

            <h4 className="font-bold mt-2 text-gray-900">{p.brand || "Unknown Brand"}</h4>

            <h3 className="font-semibold text-gray-800">{p.name}</h3>

            <p className="text-gray-700 text-sm">
              {p.type} • {p.capacity || "N/A"}
            </p>

            <p className="text-blue-700 font-semibold mt-1">AUD ${p.price}</p>

            <p className="text-gray-500 text-sm mt-2">{p.description}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Loading..." : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

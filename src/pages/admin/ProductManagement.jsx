
import { useEffect, useState, useMemo, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  fetchAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productApi";

const ProductManagement = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [priceFilterType, setPriceFilterType] = useState("less");
  const [visibleCount, setVisibleCount] = useState(9);
  const observerRef = useRef(null);

  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "",
    price: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAllProducts();
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const productTypes = useMemo(() => {
    return [...new Set(products.map((p) => p.type))].sort();
  }, [products]);

  useEffect(() => {
    let result = [...products];
    if (filterType) result = result.filter((p) => p.type === filterType);
    if (filterPrice.trim() !== "") {
      const price = parseFloat(filterPrice);
      if (!isNaN(price)) {
        result =
          priceFilterType === "less"
            ? result.filter((p) => p.price <= price)
            : result.filter((p) => p.price >= price);
      }
    }
    setFilteredProducts(result);
    setVisibleCount(9);
  }, [filterType, filterPrice, priceFilterType, products]);

  const resetFilters = () => {
    setFilterType("");
    setFilterPrice("");
    setPriceFilterType("less");
    setFilteredProducts(products);
    setVisibleCount(9);
  };

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 9, filteredProducts.length));
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [filteredProducts.length]);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64Image = await fileToBase64(file);
    setForm({ ...form, image: base64Image });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.roles?.includes("ROLE_ADMIN")) {
      alert("Only admins can modify products!");
      return;
    }

    try {
      const productPayload = {
        id: form.id,
        name: form.name,
        type: form.type,
        price: parseFloat(form.price),
        description: form.description,
        image: form.image,
      };

      if (isEditing) {
        await updateProduct(productPayload);
        alert("Product updated successfully!");
      } else {
        await addProduct(productPayload);
        alert("Product added successfully!");
      }

      setForm({
        id: null,
        name: "",
        type: "",
        price: "",
        description: "",
        image: null,
      });
      setPreview(null);
      setIsEditing(false);
      loadProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product!");
    }
  };

  const handleEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      type: p.type,
      price: p.price,
      description: p.description || "",
      image: p.image,
    });
    setPreview(p.image ? `data:image/jpeg;base64,${p.image}` : null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (p) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(p);
      alert("Product deleted successfully!");
      loadProducts();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product!");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-10 max-w-3xl mx-auto border border-gray-200"
      >
        <h3 className="text-2xl font-semibold text-blue-700 mb-4">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
            required
          />
          <input
            type="text"
            placeholder="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 sm:col-span-2 focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-lg p-2 sm:col-span-2 focus:border-blue-400"
          />
        </div>

        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-blue-300"
            />
          </div>
        )}

        <button className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:border-blue-400 transition">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="outline-none bg-transparent text-gray-700 font-medium"
          >
            <option value="">All Types</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:border-blue-400 transition">
          <input
            type="number"
            placeholder="Price"
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            className="w-24 outline-none bg-transparent text-gray-700 font-medium placeholder-gray-400"
          />
          <select
            value={priceFilterType}
            onChange={(e) => setPriceFilterType(e.target.value)}
            className="outline-none bg-transparent text-gray-700 font-medium"
          >
            <option value="less">≤</option>
            <option value="greater">≥</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="border border-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2 hover:border-blue-500 hover:text-blue-600 transition"
        >
          Reset
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.slice(0, visibleCount).map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition border border-gray-100"
          >
            {p.image ? (
              <img
                src={`data:image/jpeg;base64,${p.image}`}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-3">
                No Image
              </div>
            )}

            <h4 className="font-semibold text-blue-700">{p.name}</h4>
            <p className="text-blue-600 font-semibold">₹{p.price}</p>
            <p className="text-sm text-gray-600">{p.type}</p>
            <p className="text-gray-500 text-sm mt-1">{p.description}</p>

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

      {visibleCount < filteredProducts.length && (
        <div
          ref={observerRef}
          className="h-10 flex justify-center items-center mt-4 text-gray-500"
        >
          Loading more...
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

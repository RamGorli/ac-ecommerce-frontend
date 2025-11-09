import { useEffect, useState, useMemo, useContext } from "react";
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

  // Fetch all products
  const loadProducts = async () => {
    try {
      const data = await fetchAllProducts();
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const productTypes = useMemo(() => {
    return [...new Set(products.map((p) => p.type))].sort();
  }, [products]);

  // Filter logic
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
  }, [filterType, filterPrice, priceFilterType, products]);

  const resetFilters = () => {
    setFilterType("");
    setFilterPrice("");
    setPriceFilterType("less");
    setFilteredProducts(products);
  };

  // Convert image to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image preview
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64Image = await fileToBase64(file);
    setForm({ ...form, image: base64Image });
    setPreview(URL.createObjectURL(file));
  };

  // Add / Update Product
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
        image: form.image || null,
      };

      if (isEditing) {
        await updateProduct(productPayload);
        alert("✅ Product updated successfully!");
      } else {
        await addProduct(productPayload);
        alert("✅ Product added successfully!");
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

  // Edit product
  const handleEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      type: p.type,
      price: p.price,
      description: p.description || "",
      image: null,
    });
    setPreview(null);
    setIsEditing(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete product
  const handleDelete = async (p) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(p);
      alert("🗑 Product deleted successfully!");
      loadProducts();
    } catch (err) {
      console.error(" Delete failed:", err);
      alert("Failed to delete product!");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">
        🛠️ Product Management
      </h2>

      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded-xl mb-6 max-w-2xl mx-auto"
      >
        <h3 className="text-lg font-semibold mb-3">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg p-2"
            required
          />
          <input
            type="text"
            placeholder="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border rounded-lg p-2"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border rounded-lg p-2"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg p-2 sm:col-span-2"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border rounded-lg p-2 sm:col-span-2"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg mt-2 border"
            />
          )}
        </div>

        <button className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded w-40"
        >
          <option value="">All Types</option>
          {productTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Price"
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            className="px-3 py-2 border rounded w-24"
          />
          <select
            value={priceFilterType}
            onChange={(e) => setPriceFilterType(e.target.value)}
            className="border px-2 py-2 rounded"
          >
            <option value="less">Less Than</option>
            <option value="greater">Greater Than</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition"
          >
            {p.image ? (
              <img
                src={`data:image/jpeg;base64,${p.image}`}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <h4 className="text-lg font-semibold">{p.name}</h4>
            <p>₹{p.price}</p>
            <p className="text-gray-600 text-sm">{p.type}</p>
            <p className="text-sm mt-1 text-gray-500">{p.description}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;

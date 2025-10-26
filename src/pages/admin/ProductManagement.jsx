import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filters
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [priceFilterType, setPriceFilterType] = useState("less");

  // Form
  const [form, setForm] = useState({ name: "", type: "", price: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/find-all");
      setProducts(res.data || []);
      setFilteredProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Unique product types
  const productTypes = useMemo(() => {
    const types = [...new Set(products.map((p) => p.type))];
    return types.sort();
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

  // Form handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      alert(`Editing product: ${form.name}`);
    } else {
      alert(`Adding product: ${form.name}`);
    }
    setForm({ name: "", type: "", price: "", description: "" });
    setIsEditing(false);
  };

  const handleEdit = (p) => {
    setForm({ ...p });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    alert(`Deleting product with id: ${id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-900">Product Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-3">{isEditing ? "Edit Product" : "Add New Product"}</h3>
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
            className="border rounded-lg p-2"
          />
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded w-40"
        >
          <option value="">All Types</option>
          {productTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
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
          <div key={p.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
            <h4 className="text-lg font-semibold">{p.name}</h4>
            <p>₹{p.price}</p>
            <p className="text-gray-600 text-sm">{p.type}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
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

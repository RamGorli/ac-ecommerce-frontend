import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function ACList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [priceFilterType, setPriceFilterType] = useState("less"); // 'less' or 'greater'

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products/find-all");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filtered products dynamically
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      let res;

      if (filterType.trim() !== "" && filterPrice.trim() !== "") {
        // Both type and price filters together
        const endpoint =
          priceFilterType === "less"
            ? `/products/filter?type=${filterType}&priceLess=${filterPrice}`
            : `/products/filter?type=${filterType}&priceGreater=${filterPrice}`;
        res = await api.get(endpoint);
      } else if (filterType.trim() !== "") {
        // Filter by type
        res = await api.get(`/products/find-by-type?type=${filterType}`);
      } else if (filterPrice.trim() !== "") {
        // Filter by price
        const endpoint =
          priceFilterType === "less"
            ? `/products/less-than?price=${filterPrice}`
            : `/products/greater-than?price=${filterPrice}`;
        res = await api.get(endpoint);
      } else {
        // No filters
        res = await api.get("/products/find-all");
      }

      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch filtered products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Dynamic filtering on input change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchFilteredProducts();
    }, 600); // debounce for typing

    return () => clearTimeout(delayDebounce);
  }, [filterType, filterPrice, priceFilterType]);

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading products...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
        Our Products
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center flex-wrap">
        <input
          type="text"
          placeholder="Filter by type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 rounded-lg border w-full sm:w-64"
        />

        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Price"
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            className="px-4 py-2 rounded-lg border w-32"
          />
          <select
            value={priceFilterType}
            onChange={(e) => setPriceFilterType(e.target.value)}
            className="px-2 py-2 rounded-lg border"
          >
            <option value="less">Less Than</option>
            <option value="greater">Greater Than</option>
          </select>
        </div>

        <button
          onClick={() => {
            setFilterType("");
            setFilterPrice("");
            fetchProducts();
          }}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Reset
        </button>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col h-full"
            >
              {product.image ? (
                <img
                  src={`https://e-commerce-cndv.onrender.com${product.image}`}
                  alt={product.name}
                  className="w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover rounded-xl mb-3"
                />
              ) : (
                <div className="w-full h-48 sm:h-52 md:h-56 lg:h-60 bg-gray-200 rounded-xl mb-3 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h2 className="text-lg font-semibold mb-1 truncate">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-1 truncate">
                Type: {product.type}
              </p>
              <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                {product.description}
              </p>
              <p className="font-bold text-lg mb-4 text-blue-600">₹{product.price}</p>

              <Link
                to={`/products/${product.id}`}
                className="w-full py-2 text-center bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No products available.
        </p>
      )}
    </div>
  );
}

export default ACList;




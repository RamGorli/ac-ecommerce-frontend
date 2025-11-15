import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllProducts,
  fetchProductsByType,
  fetchProductsLessThan,
  fetchProductsGreaterThan,
} from "../services/productApi";

function ACList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [priceFilterType, setPriceFilterType] = useState("less");

  const pageSize = 10;
  const navigate = useNavigate();

  const loadData = async (page) => {
    setLoading(true);
    try {
      let data = [];

      // Apply filters properly
      if (filterType) {
        data = await fetchProductsByType(filterType, page, pageSize);
      } else if (filterPrice) {
        const price = Number(filterPrice);
        if (!isNaN(price)) {
          data =
            priceFilterType === "less"
              ? await fetchProductsLessThan(price, page, pageSize)
              : await fetchProductsGreaterThan(price, page, pageSize);
        }
      } else {
        data = await fetchAllProducts(page, pageSize);
      }

      // Use imageUrl directly (from Cloudinary)
      const mapped = data.map((p) => ({
        ...p,
        imageBase64: p.imageUrl || null,
      }));

      // Append or replace based on page
      setProducts((prev) => (page === 0 ? mapped : [...prev, ...mapped]));

      if (data.length < pageSize) setHasMore(false);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reload when filters or page change
  useEffect(() => {
    setHasMore(true);
    loadData(currentPage);
  }, [currentPage, filterType, filterPrice, priceFilterType]);

  // Extract dynamic product types
  const productTypes = useMemo(
    () => [...new Set(products.map((p) => p.type))].sort(),
    [products]
  );

  const resetFilters = () => {
    setFilterType("");
    setFilterPrice("");
    setPriceFilterType("less");
    setProducts([]);
    setCurrentPage(0);
  };

  const handleLoadMore = () => {
    if (hasMore) setCurrentPage((prev) => prev + 1);
  };

  if (!products.length && loading)
    return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Our Products
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        {/* Type filter (DYNAMIC) */}
        <select
          className="border px-3 py-2 rounded-lg"
          value={filterType}
          onChange={(e) => {
            setProducts([]);
            setCurrentPage(0);
            setFilterType(e.target.value);
          }}
        >
          <option value="">All Types</option>
          {productTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Price input */}
        <input
          type="number"
          placeholder="Price"
          className="border px-3 py-2 w-24 rounded-lg"
          value={filterPrice}
          onChange={(e) => {
            setProducts([]);
            setCurrentPage(0);
            setFilterPrice(e.target.value);
          }}
        />

        {/* Price filter type */}
        <select
          className="border px-3 py-2 rounded-lg"
          value={priceFilterType}
          onChange={(e) => {
            setProducts([]);
            setCurrentPage(0);
            setPriceFilterType(e.target.value);
          }}
        >
          <option value="less">≤ Price</option>
          <option value="greater">≥ Price</option>
        </select>

        <button onClick={resetFilters} className="border px-4 py-2 rounded-lg">
          Reset
        </button>
      </div>

      {/* Product Grid */}
     <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {products.map((p) => (
    <div
      key={p.id}
      onClick={() => navigate(`/products/${p.id}`)}
      className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
    >
      {/* Image with zoom-out effect */}
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

      {/* BRAND */}
      <h4 className="font-bold mt-2 text-gray-900 group-hover:underline">
        {p.brand || "Unknown Brand"}
      </h4>

      {/* NAME */}
      <h3 className="font-semibold text-gray-800 group-hover:underline">
        {p.name}
      </h3>

      {/* TYPE + CAPACITY */}
      <p className="text-gray-700 text-sm group-hover:underline">
        {p.type} • {p.capacity || "N/A"}
      </p>

      {/* PRICE */}
      <p className="text-blue-700 font-semibold mt-1 group-hover:underline">
        AUD ${p.price}
      </p>
    </div>
  ))}
</div>


      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            {loading ? "Loading..." : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ACList;








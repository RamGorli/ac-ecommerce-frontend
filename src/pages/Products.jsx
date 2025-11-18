
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFilteredProducts, fetchDropdownData } from "../services/productApi";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Filters Component
const Filters = ({
  filterType,
  setFilterType,
  filterBrand,
  setFilterBrand,
  filterCapacity,
  setFilterCapacity,
  filterPrice,
  setFilterPrice,
  priceFilterType,
  setPriceFilterType,
  resetFilters,
  productTypes,
  brands,
  capacities,
}) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
      <select
        className="border px-3 py-2 rounded-lg"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="">All Types</option>
        {productTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        className="border px-3 py-2 rounded-lg"
        value={filterBrand}
        onChange={(e) => setFilterBrand(e.target.value)}
      >
        <option value="">All Brands</option>
        {brands.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <select
        className="border px-3 py-2 rounded-lg"
        value={filterCapacity}
        onChange={(e) => setFilterCapacity(e.target.value)}
      >
        <option value="">All Capacities</option>
        {capacities.map((c) => (
          <option key={c} value={c}>{c}</option>
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
};

const ProductGrid = ({ products, navigate, loading, handleLoadMore, hasMore }) => (
  <>
    {products.length === 0 && !loading ? (
      <p className="text-center mt-10 text-lg text-gray-700">No products...</p>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
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

            <h4 className="font-bold mt-2 break-words">{p.brand || "Unknown Brand"}</h4>
            <h3 className="font-semibold break-words">{p.name}</h3>
            <p className="text-sm break-words">
              {p.type} • {p.capacity || "N/A"}kW
            </p>
            <p className="text-blue-700 font-semibold mt-1 break-words">AUD ${p.price}</p>
          </div>
        ))}
      </div>
    )}

    {loading && (
      <p className="text-center mt-10 text-gray-700 text-lg">Loading products...</p>
    )}

    {hasMore && !loading && products.length > 0 && (
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


// Main Component
function ACList() {
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

  // Dropdowns
  const [productTypes, setProductTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [capacities, setCapacities] = useState([]);

  const navigate = useNavigate();
  const pageSize = 8;

  // Load dropdown data
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

  // Load products function
  const loadData = useCallback(
    async (page = 0, append = false) => {
      setLoading(true);
      try {
        const filters = {
          type: filterType,
          brand: filterBrand,
          capacity: filterCapacity,
          minPrice: priceFilterType === "greater" ? Number(debouncedPrice) : "",
          maxPrice: priceFilterType === "less" ? Number(debouncedPrice) : "",
          page,
          size: pageSize,
        };

        const res = await fetchFilteredProducts(filters);
        const mapped = (res.content || []).map((p) => ({
          ...p,
          imageUrl: p.imageUrl || null,
        }));

        setProducts((prev) => (append ? [...prev, ...mapped] : mapped));
        //setHasMore(mapped.length === pageSize);
        setHasMore(!res.last);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [filterType, filterBrand, filterCapacity, debouncedPrice, priceFilterType]
  );

  // Load on filter change
  useEffect(() => {
    setCurrentPage(0);
    loadData(0, false);
  }, [loadData]);

  const handleLoadMore = () => {
    if (!hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadData(nextPage, true);
  };

  const resetFilters = () => {
    setFilterType("");
    setFilterBrand("");
    setFilterCapacity("");
    setFilterPrice("");
    setPriceFilterType("less");
    setCurrentPage(0);
    loadData(0, false);
  };

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Our Products
      </h1>

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
        navigate={navigate}
        loading={loading}
        handleLoadMore={handleLoadMore}
        hasMore={hasMore}
      />
    </div>
  );
}

export default ACList;

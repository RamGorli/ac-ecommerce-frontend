
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
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const closeAll = () => setOpenMenu(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".filter-dropdown")) closeAll();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const dropdownClass =
    "absolute left-0 top-full mt-2 shadow-lg rounded-lg py-2 z-40 border w-48 transition-all duration-200";

  const itemClass =
    "px-4 py-2 cursor-pointer hover:text-blue-600 transition-colors";

  return (
    <div className="flex flex-wrap justify-center items-center gap-6 mb-8 relative">

      {/* TYPE */}
      <div className="relative filter-dropdown">
        <button
          onClick={() => toggleMenu("type")}
          className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 flex items-center gap-2"
        >
          {filterType || "All Types"} <span className="text-gray-500">▾</span>
        </button>

        {openMenu === "type" && (
          <div className={dropdownClass}>
            <div className={itemClass} onClick={() => { setFilterType(""); closeAll(); }}>All Types</div>
            {productTypes.map((t) => (
              <div key={t} className={itemClass} onClick={() => { setFilterType(t); closeAll(); }}>
                {t}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BRAND */}
      <div className="relative filter-dropdown">
        <button
          onClick={() => toggleMenu("brand")}
          className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 flex items-center gap-2"
        >
          {filterBrand || "All Brands"} <span className="text-gray-500">▾</span>
        </button>

        {openMenu === "brand" && (
          <div className={dropdownClass}>
            <div className={itemClass} onClick={() => { setFilterBrand(""); closeAll(); }}>All Brands</div>
            {brands.map((b) => (
              <div key={b} className={itemClass} onClick={() => { setFilterBrand(b); closeAll(); }}>
                {b}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CAPACITY */}
      <div className="relative filter-dropdown">
        <button
          onClick={() => toggleMenu("capacity")}
          className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 flex items-center gap-2"
        >
          {filterCapacity || "All Capacities"} <span className="text-gray-500">▾</span>
        </button>

        {openMenu === "capacity" && (
          <div className={dropdownClass}>
            <div className={itemClass} onClick={() => { setFilterCapacity(""); closeAll(); }}>All Capacities</div>
            {capacities.map((c) => (
              <div key={c} className={itemClass} onClick={() => { setFilterCapacity(c); closeAll(); }}>
                {c}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRICE INPUT */}
      <input
        type="number"
        placeholder="Price"
        className="border px-3 py-2 w-28 rounded-lg shadow-sm"
        value={filterPrice}
        onChange={(e) => setFilterPrice(e.target.value)}
      />

      {/* PRICE TYPE DROPDOWN */}
      <div className="relative filter-dropdown">
        <button
          onClick={() => toggleMenu("price")}
          className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 flex items-center gap-2"
        >
          {priceFilterType === "less" ? "Less Than" : "Greater Than"}{" "}
          <span className="text-gray-500">▾</span>
        </button>

        {openMenu === "price" && (
          <div className={dropdownClass}>
            <div className={itemClass} onClick={() => { setPriceFilterType("less"); closeAll(); }}>
              Less Than
            </div>
            <div className={itemClass} onClick={() => { setPriceFilterType("greater"); closeAll(); }}>
              Greater Than
            </div>
          </div>
        )}
      </div>

      {/* RESET */}
      <button
        onClick={resetFilters}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
      >
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
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
          >
            {p.imageUrl ? (
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                No Image
              </div>
            )}

            <h4 className="font-bold mt-2 break-words group-hover:underline">
              {p.brand || "Unknown Brand"}
            </h4>

            <h3 className="font-semibold break-words group-hover:underline">
              {p.name}
            </h3>

            <p className="text-sm break-words group-hover:underline">
              {p.type} • {p.capacity || "N/A"}kW
            </p>

            <p className="text-blue-700 font-semibold mt-1 break-words group-hover:underline">
              AUD ${p.price}
            </p>
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


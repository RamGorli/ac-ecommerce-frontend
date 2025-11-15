
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllProducts,
  fetchProductsByType,
  fetchProductsLessThan,
  fetchProductsGreaterThan,
} from "../services/productApi";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Separate Filter Component
const Filters = ({
  filterType,
  setFilterType,
  filterPrice,
  setFilterPrice,
  priceFilterType,
  setPriceFilterType,
  resetFilters,
  productTypes,
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

      <button
        onClick={resetFilters}
        className="border px-4 py-2 rounded-lg"
      >
        Reset
      </button>
    </div>
  );
};

// Product Grid Component
// const ProductGrid = ({ products, navigate, loading, handleLoadMore, hasMore }) => {
//   return (
//     <>
//       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {products.map((p) => (
//           <div
//             key={p.id}
//             onClick={() => navigate(`/products/${p.id}`)}
//             className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
//           >
//             {p.imageBase64 ? (
//               <img
//                 src={p.imageBase64}
//                 alt={p.name}
//                 className="w-full h-48 object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-95"
//               />
//             ) : (
//               <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
//                 No Image
//               </div>
//             )}

//             <h4 className="font-bold mt-2 text-gray-900 group-hover:underline">
//               {p.brand || "Unknown Brand"}
//             </h4>

//             <h3 className="font-semibold text-gray-800 group-hover:underline">
//               {p.name}
//             </h3>

//             <p className="text-gray-700 text-sm group-hover:underline">
//               {p.type} • {p.capacity || "N/A"}
//             </p>

//             <p className="text-blue-700 font-semibold mt-1 group-hover:underline">
//               AUD ${p.price}
//             </p>
//           </div>
//         ))}
//       </div>
      
//       {loading && products.length > 0 && (
//         <p className="text-center mt-6 text-gray-700 text-lg">
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
// };

const ProductGrid = ({ products, navigate, loading, handleLoadMore, hasMore }) => {
  
  const showLoading = loading;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
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

            <h4 className="font-bold mt-2 text-gray-900 group-hover:underline">
              {p.brand || "Unknown Brand"}
            </h4>

            <h3 className="font-semibold text-gray-800 group-hover:underline">
              {p.name}
            </h3>

            <p className="text-gray-700 text-sm group-hover:underline">
              {p.type} • {p.capacity || "N/A"}
            </p>

            <p className="text-blue-700 font-semibold mt-1 group-hover:underline">
              AUD ${p.price}
            </p>
          </div>
        ))}
      </div>

      {showLoading && (
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
};


function ACList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [priceFilterType, setPriceFilterType] = useState("less");

  const debouncedPrice = useDebounce(filterPrice, 300);
  const pageSize = 10;
  const navigate = useNavigate();

  // Load data function
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
          }
        } else {
          data = await fetchAllProducts(page, pageSize);
        }

        const mapped = data.map((p) => ({
          ...p,
          imageBase64: p.imageUrl || null,
        }));

        setProducts((prev) => (append ? [...prev, ...mapped] : mapped));

        setHasMore(data.length === pageSize);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [filterType, debouncedPrice, priceFilterType]
  );

  // Load products on filter change
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

  const productTypes = useMemo(
    () => [...new Set(products.map((p) => p.type))].sort(),
    [products]
  );

  const resetFilters = () => {
    setFilterType("");
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

      {/* Filters always visible */}
      <Filters
        filterType={filterType}
        setFilterType={setFilterType}
        filterPrice={filterPrice}
        setFilterPrice={setFilterPrice}
        priceFilterType={priceFilterType}
        setPriceFilterType={setPriceFilterType}
        resetFilters={resetFilters}
        productTypes={productTypes}
      />

      {/* Product Grid */}
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


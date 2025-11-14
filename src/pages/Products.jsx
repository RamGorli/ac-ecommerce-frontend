import { useEffect, useState, useMemo, useRef } from "react";
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

  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [priceFilterType, setPriceFilterType] = useState("less");

  const [visibleCount, setVisibleCount] = useState(9);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  const convertImage = (p) => {
    if (p.image) {
      const binary = Uint8Array.from(p.image);
      let base64 = "";
      for (let i = 0; i < binary.length; i++) base64 += String.fromCharCode(binary[i]);
      return { ...p, imageBase64: `data:image/jpeg;base64,${btoa(base64)}` };
    }
    return p;
  };

  const loadProducts = async () => {
    setLoading(true);
    let data = [];

    if (filterType !== "") {
      data = await fetchProductsByType(filterType);
    } else if (filterPrice !== "") {
      if (priceFilterType === "less") {
        data = await fetchProductsLessThan(filterPrice);
      } else {
        data = await fetchProductsGreaterThan(filterPrice);
      }
    } else {
      data = await fetchAllProducts();
    }

    setProducts(data.map(convertImage));
    setVisibleCount(9);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [filterType, filterPrice, priceFilterType]);

  const productTypes = useMemo(() => {
    return [...new Set(products.map((p) => p.type))].sort();
  }, [products]);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 9, products.length));
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [products.length]);

  const resetFilters = () => {
    setFilterType("");
    setFilterPrice("");
    setPriceFilterType("less");
  };

  if (loading)
    return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Our Products
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        
        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg"
        >
          <option value="">All Types</option>
          {productTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        {/* Price Filter */}
        <input
          type="number"
          placeholder="Price"
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg"
        />

        <select
          value={priceFilterType}
          onChange={(e) => setPriceFilterType(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg"
        >
          <option value="less">≤</option>
          <option value="greater">≥</option>
        </select>

        <button
          onClick={resetFilters}
          className="px-4 py-2 border border-gray-400 rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, visibleCount).map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg cursor-pointer"
          >
            {p.imageBase64 ? (
              <img
                src={p.imageBase64}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                No Image
              </div>
            )}

            <h4 className="font-semibold">{p.name}</h4>
            <p className="text-gray-700">₹{p.price}</p>
            <p className="text-gray-500 text-sm">{p.type}</p>
          </div>
        ))}
      </div>

      {visibleCount < products.length && (
        <div ref={observerRef} className="h-10 text-center mt-4 text-gray-500">
          Loading more...
        </div>
      )}
    </div>
  );
}

export default ACList;

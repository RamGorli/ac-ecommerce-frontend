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

      // Convert image bytes
      const converted = data.map((p) => {
        let imageBase64 = null;

        if (Array.isArray(p.image)) {
          const binary = Uint8Array.from(p.image);
          let base64 = "";
          for (let i = 0; i < binary.length; i++)
            base64 += String.fromCharCode(binary[i]);
          imageBase64 = `data:image/jpeg;base64,${btoa(base64)}`;
        } else if (
          typeof p.image === "string" &&
          !p.image.startsWith("data:")
        ) {
          imageBase64 = `data:image/jpeg;base64,${p.image}`;
        }

        return { ...p, imageBase64 };
      });

      // Append or replace based on page
      setProducts((prev) => (page === 0 ? converted : [...prev, ...converted]));

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

  // SAME as old commented file
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
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
          >
            {p.imageBase64 ? (
              <img
                src={p.imageBase64}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                No Image
              </div>
            )}
            <h4 className="font-semibold mt-2">{p.name}</h4>
            <p className="text-gray-700">₹{p.price}</p>
            <p className="text-gray-600 text-sm">{p.type}</p>
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













// import { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchAllProducts } from "../services/productApi";

// function ACList() {
//   const [allProducts, setAllProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [filterType, setFilterType] = useState("");
//   const [filterPrice, setFilterPrice] = useState("");
//   const [priceFilterType, setPriceFilterType] = useState("less");

//   const pageSize = 10;
//   const navigate = useNavigate();

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

//   // Fetch products on page change
//   useEffect(() => {
//     loadProducts(currentPage);
//   }, [currentPage]);

//   // Unique product types for filter dropdown
//   const productTypes = useMemo(
//     () => [...new Set(allProducts.map((p) => p.type))].sort(),
//     [allProducts]
//   );

//   // Apply filters whenever products or filter values change
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
//   }, [filterType, filterPrice, priceFilterType, allProducts]);

//   const resetFilters = () => {
//     setFilterType("");
//     setFilterPrice("");
//     setPriceFilterType("less");
//   };

//   const handleLoadMore = () => {
//     if (hasMore) setCurrentPage((prev) => prev + 1);
//   };

//   if (!allProducts.length && loading)
//     return <p className="text-center mt-10">Loading products...</p>;

//   return (
//     <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Products</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
//         <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:border-blue-400 transition">
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="outline-none bg-transparent text-blue-600 font-medium hover:text-blue-700 focus:text-blue-700"
//           >
//             <option value="" className="text-gray-500">All Types</option>
//             {productTypes.map((type) => (
//               <option key={type} value={type} className="text-gray-700">{type}</option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:border-blue-400 transition">
//           <input
//             type="number"
//             placeholder="Price"
//             value={filterPrice}
//             onChange={(e) => setFilterPrice(e.target.value)}
//             className="w-24 outline-none bg-transparent text-blue-600 font-medium placeholder-gray-400"
//           />
//           <select
//             value={priceFilterType}
//             onChange={(e) => setPriceFilterType(e.target.value)}
//             className="outline-none bg-transparent text-blue-600 font-medium hover:text-blue-700 focus:text-blue-700"
//           >
//             <option value="less">Lesser</option>
//             <option value="greater">Greater</option>
//           </select>
//         </div>

//         <button
//           onClick={resetFilters}
//           className="border border-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2 hover:border-blue-500 hover:text-blue-600 transition duration-150 ease-in-out"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Product Grid */}
//       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {filteredProducts.map((p) => (
//           <div
//             key={p.id}
//             onClick={() => navigate(`/products/${p.id}`)}
//             className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
//           >
//             {p.imageBase64 ? (
//               <img
//                 src={p.imageBase64}
//                 alt={p.name}
//                 className="w-full h-48 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
//               />
//             ) : (
//               <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
//                 No Image
//               </div>
//             )}
//             <h4 className="font-semibold group-hover:underline">{p.name}</h4>
//             <p className="text-gray-700">₹{p.price}</p>
//             <p className="text-gray-600 text-sm group-hover:underline">{p.type}</p>
//           </div>
//         ))}
//       </div>

//       {hasMore && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handleLoadMore}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             {loading ? "Loading..." : "Show More"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ACList;




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchAllProducts,
//   fetchProductsByType,
//   fetchProductsLessThan,
//   fetchProductsGreaterThan,
// } from "../services/productApi";

// function ACList() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [currentPage, setCurrentPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);

//   const [filterType, setFilterType] = useState("");
//   const [filterPrice, setFilterPrice] = useState("");
//   const [priceFilterType, setPriceFilterType] = useState("less");

//   const pageSize = 10;
//   const navigate = useNavigate();

//   const loadData = async (page) => {
//     setLoading(true);
//     try {
//       let data = [];

//       if (filterType) {
//         data = await fetchProductsByType(filterType, page, pageSize);
//       } else if (filterPrice) {
//         const price = Number(filterPrice);
//         if (!isNaN(price)) {
//           data =
//             priceFilterType === "less"
//               ? await fetchProductsLessThan(price, page, pageSize)
//               : await fetchProductsGreaterThan(price, page, pageSize);
//         }
//       } else {
//         data = await fetchAllProducts(page, pageSize);
//       }

//       // Convert images
//       const converted = data.map((p) => {
//         let imageBase64 = null;
//         if (Array.isArray(p.image)) {
//           const binary = Uint8Array.from(p.image);
//           let base64 = "";
//           for (let i = 0; i < binary.length; i++) base64 += String.fromCharCode(binary[i]);
//           imageBase64 = `data:image/jpeg;base64,${btoa(base64)}`;
//         } else if (typeof p.image === "string" && !p.image.startsWith("data:")) {
//           imageBase64 = `data:image/jpeg;base64,${p.image}`;
//         }
//         return { ...p, imageBase64 };
//       });

//       setProducts((prev) => (page === 0 ? converted : [...prev, ...converted]));
//       if (data.length < pageSize) setHasMore(false);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Trigger when filters or page changes
//   useEffect(() => {
//     setHasMore(true);
//     loadData(currentPage);
//   }, [currentPage, filterType, filterPrice, priceFilterType]);

//   const resetFilters = () => {
//     setFilterType("");
//     setFilterPrice("");
//     setPriceFilterType("less");
//     setProducts([]);
//     setCurrentPage(0);
//   };

//   const handleLoadMore = () => {
//     if (hasMore) setCurrentPage((prev) => prev + 1);
//   };

//   return (
//     <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//         Our Products
//       </h1>

//       {/* Filters */}
//       <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
//         {/* Type filter */}
//         <select
//           className="border px-3 py-2 rounded-lg"
//           value={filterType}
//           onChange={(e) => {
//             setProducts([]);
//             setCurrentPage(0);
//             setFilterType(e.target.value);
//           }}
//         >
//           <option value="">All Types</option>
//           <option value="AC">AC</option>
//           <option value="Cooler">Cooler</option>
//           <option value="Fan">Fan</option>
//           {/* Add more static types if needed */}
//         </select>

//         {/* Price input */}
//         <input
//           type="number"
//           placeholder="Price"
//           className="border px-3 py-2 w-24 rounded-lg"
//           value={filterPrice}
//           onChange={(e) => {
//             setProducts([]);
//             setCurrentPage(0);
//             setFilterPrice(e.target.value);
//           }}
//         />

//         {/* Less/Greater filter */}
//         <select
//           className="border px-3 py-2 rounded-lg"
//           value={priceFilterType}
//           onChange={(e) => {
//             setProducts([]);
//             setCurrentPage(0);
//             setPriceFilterType(e.target.value);
//           }}
//         >
//           <option value="less">≤ Price</option>
//           <option value="greater">≥ Price</option>
//         </select>

//         <button
//           onClick={resetFilters}
//           className="border px-4 py-2 rounded-lg"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Product Grid */}
//       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {products.map((p) => (
//           <div
//             key={p.id}
//             onClick={() => navigate(`/products/${p.id}`)}
//             className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
//           >
//             {p.imageBase64 ? (
//               <img
//                 src={p.imageBase64}
//                 alt={p.name}
//                 className="w-full h-48 object-cover rounded-lg"
//               />
//             ) : (
//               <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
//                 No Image
//               </div>
//             )}
//             <h4 className="font-semibold mt-2">{p.name}</h4>
//             <p className="text-gray-700">₹{p.price}</p>
//             <p className="text-gray-600 text-sm">{p.type}</p>
//           </div>
//         ))}
//       </div>

//       {hasMore && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handleLoadMore}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             {loading ? "Loading..." : "Show More"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ACList;

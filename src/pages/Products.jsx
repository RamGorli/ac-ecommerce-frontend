// import { useEffect, useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { fetchAllProducts } from "../services/productApi";

// function ACList() {
//   const [allProducts, setAllProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterType, setFilterType] = useState("");
//   const [filterPrice, setFilterPrice] = useState("");
//   const [priceFilterType, setPriceFilterType] = useState("less");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchAllProducts();
//         setAllProducts(data || []);
//         setFilteredProducts(data || []);
//       } catch (err) {
//         console.error("❌ Failed to fetch products:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const productTypes = useMemo(() => {
//     return [...new Set(allProducts.map((p) => p.type))].sort();
//   }, [allProducts]);

//   useEffect(() => {
//     let result = [...allProducts];
//     if (filterType) result = result.filter((p) => p.type === filterType);
//     if (filterPrice.trim() !== "") {
//       const price = parseFloat(filterPrice);
//       if (!isNaN(price)) {
//         result =
//           priceFilterType === "less"
//             ? result.filter((p) => p.price <= price)
//             : result.filter((p) => p.price >= price);
//       }
//     }
//     setFilteredProducts(result);
//   }, [filterType, filterPrice, priceFilterType, allProducts]);

//   const resetFilters = () => {
//     setFilterType("");
//     setFilterPrice("");
//     setPriceFilterType("less");
//     setFilteredProducts(allProducts);
//   };

//   if (loading) return <p className="text-center mt-10">Loading products...</p>;

//   return (
//     <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Products</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="border p-2 rounded w-40"
//         >
//           <option value="">All Types</option>
//           {productTypes.map((type) => (
//             <option key={type} value={type}>{type}</option>
//           ))}
//         </select>

//         <div className="flex gap-2 items-center">
//           <input
//             type="number"
//             placeholder="Price"
//             value={filterPrice}
//             onChange={(e) => setFilterPrice(e.target.value)}
//             className="px-3 py-2 border rounded w-24"
//           />
//           <select
//             value={priceFilterType}
//             onChange={(e) => setPriceFilterType(e.target.value)}
//             className="border px-2 py-2 rounded"
//           >
//             <option value="less">Less Than</option>
//             <option value="greater">Greater Than</option>
//           </select>
//         </div>

//         <button
//           onClick={resetFilters}
//           className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Grid */}
//       <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
//         {filteredProducts.map((p) => (
//           <div
//             key={p.id}
//             className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
//           >
//             {p.imageBase64 ? (
//               <img
//                 src={p.imageBase64}
//                 alt={p.name}
//                 className="w-full h-48 object-cover rounded-lg mb-3"
//               />
//             ) : (
//               <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
//                 No Image
//               </div>
//             )}
//             <h4 className="font-semibold">{p.name}</h4>
//             <p>₹{p.price}</p>
//             <p className="text-gray-600 text-sm">{p.type}</p>
//             <p className="text-gray-500 text-sm">{p.description}</p>
//             <Link
//               to={`/products/${p.id}`}
//               className="block mt-3 bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600"
//             >
//               View Details
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ACList;


import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchAllProducts } from "../services/productApi";

function ACList() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [priceFilterType, setPriceFilterType] = useState("less");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchAllProducts();

        // ✅ Convert backend byte[] to Base64 for frontend display
        const converted = data.map((p) => {
          if (p.image && Array.isArray(p.image)) {
            const binary = Uint8Array.from(p.image);
            let base64 = "";
            for (let i = 0; i < binary.length; i++) {
              base64 += String.fromCharCode(binary[i]);
            }
            return { ...p, imageBase64: `data:image/jpeg;base64,${btoa(base64)}` };
          }
          // In case backend already returns base64
          if (typeof p.image === "string" && !p.image.startsWith("data:")) {
            return { ...p, imageBase64: `data:image/jpeg;base64,${p.image}` };
          }
          return { ...p };
        });

        setAllProducts(converted || []);
        setFilteredProducts(converted || []);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const productTypes = useMemo(() => {
    return [...new Set(allProducts.map((p) => p.type))].sort();
  }, [allProducts]);

  useEffect(() => {
    let result = [...allProducts];
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
  }, [filterType, filterPrice, priceFilterType, allProducts]);

  const resetFilters = () => {
    setFilterType("");
    setFilterPrice("");
    setPriceFilterType("less");
    setFilteredProducts(allProducts);
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Our Products
      </h1>

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
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            {p.imageBase64 ? (
              <img
                src={p.imageBase64}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <h4 className="font-semibold">{p.name}</h4>
            <p>₹{p.price}</p>
            <p className="text-gray-600 text-sm">{p.type}</p>
            <p className="text-gray-500 text-sm">{p.description}</p>
            <Link
              to={`/products/${p.id}`}
              className="block mt-3 bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ACList;

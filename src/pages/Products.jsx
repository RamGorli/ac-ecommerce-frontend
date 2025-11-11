// import { useEffect, useState, useMemo, useRef } from "react";
// import { Link } from "react-router-dom";
// import { fetchAllProducts } from "../services/productApi";

// function ACList() {
//   const [allProducts, setAllProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterType, setFilterType] = useState("");
//   const [filterPrice, setFilterPrice] = useState("");
//   const [priceFilterType, setPriceFilterType] = useState("less");
//   const [visibleCount, setVisibleCount] = useState(9);
//   const observerRef = useRef(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchAllProducts();

//         const converted = data.map((p) => {
//           if (p.image && Array.isArray(p.image)) {
//             const binary = Uint8Array.from(p.image);
//             let base64 = "";
//             for (let i = 0; i < binary.length; i++) {
//               base64 += String.fromCharCode(binary[i]);
//             }
//             return { ...p, imageBase64: `data:image/jpeg;base64,${btoa(base64)}` };
//           }
//           if (typeof p.image === "string" && !p.image.startsWith("data:")) {
//             return { ...p, imageBase64: `data:image/jpeg;base64,${p.image}` };
//           }
//           return p;
//         });

//         setAllProducts(converted || []);
//         setFilteredProducts(converted || []);
//       } catch (err) {
//         console.error("Failed to fetch products:", err);
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
//     setVisibleCount(9);
//   }, [filterType, filterPrice, priceFilterType, allProducts]);

//   const resetFilters = () => {
//     setFilterType("");
//     setFilterPrice("");
//     setPriceFilterType("less");
//     setFilteredProducts(allProducts);
//     setVisibleCount(9);
//   };

//   useEffect(() => {
//     if (!observerRef.current) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           setVisibleCount((prev) => Math.min(prev + 9, filteredProducts.length));
//         }
//       },
//       { threshold: 1.0 }
//     );

//     observer.observe(observerRef.current);
//     return () => observer.disconnect();
//   }, [filteredProducts.length]);

//   if (loading) return <p className="text-center mt-10">Loading products...</p>;

//   return (
//     <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Products</h1>

//       <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        
//         <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:border-blue-400 transition">
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="outline-none bg-transparent text-blue-600 font-medium hover:text-blue-700 focus:text-blue-700"
//           >
//             <option value="" className="text-gray-500">All Types</option>
//             {productTypes.map((type) => (
//               <option key={type} value={type} className="text-gray-700">
//                 {type}
//               </option>
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
//             <option value="less">≤</option>
//             <option value="greater">≥</option>
//           </select>
//         </div>

//         <button
//           onClick={resetFilters}
//           className="border border-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2 hover:border-blue-500 hover:text-blue-600 transition duration-150 ease-in-out"
//         >
//           Reset
//         </button>
//       </div>


//       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {filteredProducts.slice(0, visibleCount).map((p) => (
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
//               className="block mt-3 bg-blue-600 text-white text-center py-2 rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition duration-150 ease-in-out"
//             >
//               View Details
//             </Link>
//           </div>
//         ))}
//       </div>

//       {visibleCount < filteredProducts.length && (
//         <div ref={observerRef} className="h-10 flex justify-center items-center mt-4 text-gray-500">
//           Loading more...
//         </div>
//       )}
//     </div>
//   );
// }

// export default ACList;




import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../services/productApi";

function ACList() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [priceFilterType, setPriceFilterType] = useState("less");
  const [visibleCount, setVisibleCount] = useState(9);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchAllProducts();

        const converted = data.map((p) => {
          if (p.image && Array.isArray(p.image)) {
            const binary = Uint8Array.from(p.image);
            let base64 = "";
            for (let i = 0; i < binary.length; i++) {
              base64 += String.fromCharCode(binary[i]);
            }
            return { ...p, imageBase64: `data:image/jpeg;base64,${btoa(base64)}` };
          }
          if (typeof p.image === "string" && !p.image.startsWith("data:")) {
            return { ...p, imageBase64: `data:image/jpeg;base64,${p.image}` };
          }
          return p;
        });

        setAllProducts(converted || []);
        setFilteredProducts(converted || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
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
    setVisibleCount(9);
  }, [filterType, filterPrice, priceFilterType, allProducts]);

  const resetFilters = () => {
    setFilterType("");
    setFilterPrice("");
    setPriceFilterType("less");
    setFilteredProducts(allProducts);
    setVisibleCount(9);
  };

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 9, filteredProducts.length));
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [filteredProducts.length]);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Products</h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:border-blue-400 transition">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="outline-none bg-transparent text-blue-600 font-medium hover:text-blue-700 focus:text-blue-700"
          >
            <option value="" className="text-gray-500">All Types</option>
            {productTypes.map((type) => (
              <option key={type} value={type} className="text-gray-700">
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:border-blue-400 transition">
          <input
            type="number"
            placeholder="Price"
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            className="w-24 outline-none bg-transparent text-blue-600 font-medium placeholder-gray-400"
          />
          <select
            value={priceFilterType}
            onChange={(e) => setPriceFilterType(e.target.value)}
            className="outline-none bg-transparent text-blue-600 font-medium hover:text-blue-700 focus:text-blue-700"
          >
            <option value="less">≤</option>
            <option value="greater">≥</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="border border-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2 hover:border-blue-500 hover:text-blue-600 transition duration-150 ease-in-out"
        >
          Reset
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.slice(0, visibleCount).map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
          >
            {p.imageBase64 ? (
              <img
                src={p.imageBase64}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <h4 className="font-semibold group-hover:underline">{p.name}</h4>
            <p className="text-gray-700">₹{p.price}</p>
            <p className="text-gray-600 text-sm group-hover:underline">{p.type}</p>
            <p className="text-gray-500 text-sm">{p.description}</p>
          </div>
        ))}
      </div>

      {visibleCount < filteredProducts.length && (
        <div ref={observerRef} className="h-10 flex justify-center items-center mt-4 text-gray-500">
          Loading more...
        </div>
      )}
    </div>
  );
}

export default ACList;


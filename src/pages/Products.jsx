// import React from 'react'

// const Products = () => {
//   return (
//     <div className="text-4xl sm:text-5xl font-bold text-blue-900 text-center my-8">
//     Products
//     </div>  
//   )
// }

// export default Products



import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function ACList() {
  const [acs, setAcs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ACs from backend
  const fetchACs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/acs/all");
      setAcs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch ACs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchACs();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading ACs...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Our ACs</h1>

      {acs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {acs.map((ac) => (
            <div
              key={ac.id}
              className="bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition p-4 flex flex-col h-full"
            >
              {ac.image ? (
                <img
                  src={`http://localhost:8080${ac.image}`}
                  alt={ac.name}
                  className="w-full h-48 sm:h-52 lg:h-56 object-cover rounded-xl mb-3"
                />
              ) : (
                <div className="w-full h-48 sm:h-52 lg:h-56 bg-gray-200 rounded-xl mb-3 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h2 className="text-lg font-semibold mb-1">{ac.name}</h2>
              <p className="text-gray-600 text-sm mb-1">Brand: {ac.brand}</p>
              <p className="text-gray-600 text-sm mb-2">Type: {ac.category}</p>
              <p className="font-bold text-lg mb-4 text-blue-600">${ac.price}</p>

              <Link
                to={`/acs/${ac.id}`}
                className="w-full py-2 text-center bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No ACs available.
        </p>
      )}
    </div>
  );
}

export default ACList;


//Arjun's

// import { useEffect, useState } from "react";
// import api from "../services/api";
// import { Link } from "react-router-dom";

// function ACList() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/products/find-all");
//       setProducts(res.data || []);
//     } catch (err) {
//       console.error("Failed to fetch products:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-10">Loading products...</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 py-10">
//       <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
//         Our Products
//       </h1>

//       {products.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition p-4 flex flex-col h-full"
//             >
//               {product.image ? (
//                 <img
//                   src={`https://e-commerce-cndv.onrender.com${product.image}`}
//                   alt={product.name}
//                   className="w-full h-48 sm:h-52 lg:h-56 object-cover rounded-xl mb-3"
//                 />
//               ) : (
//                 <div className="w-full h-48 sm:h-52 lg:h-56 bg-gray-200 rounded-xl mb-3 flex items-center justify-center text-gray-500">
//                   No Image
//                 </div>
//               )}

//               <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
//               <p className="text-gray-600 text-sm mb-1">Type: {product.type}</p>
//               <p className="text-gray-600 text-sm mb-2">{product.description}</p>
//               <p className="font-bold text-lg mb-4 text-blue-600">
//                 ₹{product.price}
//               </p>

//               <Link
//                 to={`/products/${product.id}`}
//                 className="w-full py-2 text-center bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
//               >
//                 View Details
//               </Link>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500 mt-10 text-lg">
//           No products available.
//         </p>
//       )}
//     </div>
//   );
// }

// export default ACList;

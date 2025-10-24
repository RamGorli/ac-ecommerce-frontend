import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { addToCart } from "../services/cartApi";

function ProductDetails() {
  const { id } = useParams(); // get product id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/find-by-id/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(localStorage.getItem("email"), product.id);
      alert(`${product.name} added to cart 🛒`);
    } catch (err) {
      alert("Failed to add to cart");
      console.error(err);
    }
  };

  const handleOrderNow = () => {
    alert(`Proceeding to order ${product.name} 🛍️`);
    // direct order logic or navigate to checkout
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg text-gray-700">
        Loading product details...
      </p>
    );
  }

  if (!product) {
    return (
      <p className="text-center mt-10 text-lg text-gray-600">
        Product not found.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="flex-1 flex justify-center items-center">
          {product.image ? (
            <img
              src={`https://e-commerce-cndv.onrender.com${product.image}`}
              alt={product.name}
              className="w-full max-w-sm h-auto rounded-2xl object-cover shadow-md"
            />
          ) : (
            <div className="w-full max-w-sm h-64 bg-gray-200 rounded-2xl flex justify-center items-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 text-lg">
            <span className="font-semibold">Type:</span> {product.type}
          </p>
          <p className="text-gray-700 text-base leading-relaxed">
            {product.description || "No description available."}
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-4">₹{product.price}</p>

          <div className="flex gap-4 mt-6 flex-col sm:flex-row">
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleOrderNow}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

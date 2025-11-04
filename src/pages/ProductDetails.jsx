
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { addToCart } from "../services/cartApi";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/find-by-id/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch product:", err);
      alert("❌ Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const res = await addToCart(localStorage.getItem("email"), product.id);
      alert(res.message || `${product.name} added to cart 🛒`);
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("❌ Failed to add to cart.");
    }
  };

  const handleOrderNow = () => {
    const email = localStorage.getItem("email");
    if (!email) return alert("Please log in to continue.");
    navigate("/checkout", { state: { productId: product.id } });
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-lg text-gray-700">
        Loading product details...
      </p>
    );

  if (!product)
    return (
      <p className="text-center mt-10 text-lg text-gray-600">
        Product not found.
      </p>
    );

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center hover:shadow-xl transition">
        {/* ✅ Product Image Section */}
        <div className="flex-1 flex justify-center items-center">
          {product.image ? (
            <img
              src={`data:image/jpeg;base64,${product.image}`}
              alt={product.name}
              className="w-full max-w-sm h-[360px] object-cover rounded-2xl shadow-md"
            />
          ) : (
            <div className="w-full max-w-sm h-[360px] bg-gray-200 rounded-2xl flex justify-center items-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* ✅ Product Details Section */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

          <div className="space-y-1">
            <p className="text-gray-600 text-lg">
              <span className="font-semibold">Type:</span> {product.type}
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>

          <p className="text-2xl font-bold text-blue-600 mt-4">
            ₹{product.price}
          </p>

          {/* ✅ Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleOrderNow}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
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

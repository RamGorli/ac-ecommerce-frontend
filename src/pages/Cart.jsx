import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeFromCart, emptyCart } from "../services/cartApi";
import api from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (email) fetchCart();
  }, [email]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      if (!email) return;

      const { cart } = await getCart(email);
      setCart(cart);

      const productData = await Promise.all(
        cart.map((id) =>
          api.get(`/products/find-by-id/${id}`).then((res) => res.data)
        )
      );
      setProducts(productData);
    } catch (error) {
      console.error("Error loading cart:", error);
      alert("Error loading cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(email, productId);
      alert("Product removed");
      fetchCart();
    } catch (error) {
      console.error(error);
      alert("Failed to remove product");
    }
  };

  const handleEmpty = async () => {
    try {
      await emptyCart(email);
      alert("Cart cleared");
      fetchCart();
    } catch (error) {
      console.error(error);
      alert("Failed to clear cart");
    }
  };

  const handleProceedToCheckout = () => {
    if (products.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading cart...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
        🛒 Your Cart
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-lg">Your cart is empty</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col h-full"
              >
                {product.image ? (
                  <img
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-xl mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-3 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h2 className="text-lg font-semibold mb-1 truncate">{product.name}</h2>
                <p className="text-gray-600 text-sm mb-1 truncate">Type: {product.type}</p>
                <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                  {product.description}
                </p>
                <p className="font-bold text-lg mb-4 text-blue-600">₹{product.price}</p>

                <div className="flex gap-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1 py-2 text-center bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleEmpty}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              🗑️ Empty Cart
            </button>
            <button
              onClick={handleProceedToCheckout}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;




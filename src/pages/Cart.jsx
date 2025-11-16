
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, removeFromCart, emptyCart } from "../services/cartApi";
import { fetchProductById } from "../services/productApi";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [email]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      let items = [];
      let qtyMap = {};

      if (email) {
        // Logged-in: fetch from backend
        const { cart } = await getCart(email);
        const productsData = await Promise.all(cart.map((id) => fetchProductById(id)));
        items = productsData;

        // Load quantities from localStorage
        const saved = JSON.parse(localStorage.getItem("cartQuantities") || "{}");
        productsData.forEach((p) => {
          qtyMap[p.id] = saved[p.id] || 1;
        });
      } else {
        // Guest user: fetch from localStorage
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        items = guestCart;
        guestCart.forEach((p) => {
          qtyMap[p.id] = p.quantity || 1;
        });
      }

      setProducts(items);
      setQuantities(qtyMap);
    } catch (err) {
      console.error("Error loading cart:", err);
      alert("Error loading cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveQuantities = (updated) => {
    if (email) {
      localStorage.setItem("cartQuantities", JSON.stringify(updated));
    } else {
      // Update guestCart quantities
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const updatedCart = guestCart.map((p) => ({
        ...p,
        quantity: updated[p.id] || 1,
      }));
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

  const increaseQty = (id) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: prev[id] + 1 };
      saveQuantities(updated);
      return updated;
    });
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: Math.max(1, prev[id] - 1) };
      saveQuantities(updated);
      return updated;
    });
  };

  const handleRemove = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this item from your cart?")) return;

    try {
      if (email) {
        await removeFromCart(email, productId);
        const saved = JSON.parse(localStorage.getItem("cartQuantities") || "{}");
        delete saved[productId];
        localStorage.setItem("cartQuantities", JSON.stringify(saved));
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const updated = guestCart.filter((p) => p.id !== productId);
        localStorage.setItem("guestCart", JSON.stringify(updated));
      }
      alert("Item removed from your cart!");
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to remove product. Please try again.");
    }
  };

  const handleEmpty = async () => {
    if (!window.confirm("Are you sure you want to empty your cart?")) return;

    try {
      if (email) {
        await emptyCart(email);
        localStorage.removeItem("cartQuantities");
      } else {
        localStorage.removeItem("guestCart");
      }
      alert("Cart cleared successfully!");
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to clear cart. Please try again.");
    }
  };

  const handleCheckout = () => {
    if (!products.length) {
      alert("Your cart is empty!");
      return;
    }

    const checkoutItems = products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      quantity: quantities[p.id],
      imageUrl: p.imageUrl,
      type: p.type,
      capacity: p.capacity,
      description: p.description,
    }));

    navigate("/checkout", { state: { items: checkoutItems, guest: !email } });
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading cart...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Cart
      </h1>

      {!products.length ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          Your cart is empty
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer group"
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <h4 className="font-semibold group-hover:underline">{product.brand || "Unknown Brand"}</h4>
                <h3 className="font-semibold text-gray-800 group-hover:underline">{product.name}</h3>
                <p className="text-gray-700 text-sm group-hover:underline">
                  {product.type} • {product.capacity || "N/A"}
                </p>
                <p className="text-blue-700 font-semibold mt-1">AUD ${product.price}</p>

                {/* Quantity */}
                <div
                  className="flex items-center gap-3 mt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => decreaseQty(product.id)}
                    className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-lg font-bold hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold">{quantities[product.id]}</span>
                  <button
                    onClick={() => increaseQty(product.id)}
                    className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-lg font-bold hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(product.id);
                  }}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 cursor-pointer w-fit"
                >
                  🗑️ Remove
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleEmpty}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Empty Cart
            </button>

            <button
              onClick={handleCheckout}
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

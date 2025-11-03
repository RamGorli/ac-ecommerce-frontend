import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getCart, emptyCart } from "../services/cartApi";
import { placeOrder } from "../services/orderApi";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(true);

  const productId = location.state?.productId;

  useEffect(() => {
    if (!email) {
      alert("Please log in to continue.");
      navigate("/login");
      return;
    }

    if (productId) {
      // Coming from ProductDetails (single product)
      fetchSingleProduct(productId);
    } else {
      // Coming from Cart
      fetchCartProducts();
    }
  }, [email, productId]);

  const fetchSingleProduct = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/products/find-by-id/${id}`);
      setProducts([res.data]);
    } catch (err) {
      console.error(err);
      alert("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartProducts = async () => {
    try {
      const { cart } = await getCart(email);
      const productData = await Promise.all(
        cart.map((id) =>
          api.get(`/products/find-by-id/${id}`).then((res) => res.data)
        )
      );
      setProducts(productData);
    } catch (err) {
      console.error(err);
      alert("Failed to load cart products");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address || !pinCode) {
      alert("Please enter delivery address and pin code.");
      return;
    }

    try {
      for (const p of products) {
        await placeOrder({
          productId: p.id,
          userEmail: email,
          orderStatus: "PLACED",
          address,
          pinCode: parseInt(pinCode),
        });
      }

      if (!productId) {
        await emptyCart(email);
      }

      alert("✅ Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Order error:", err);
      alert("❌ Failed to place order. Try again.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading checkout...</p>;

  if (products.length === 0)
    return <p className="text-center mt-10 text-gray-500">No products to checkout.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🧾 Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-gray-50 rounded-xl p-4 flex gap-4 items-center shadow-sm"
            >
              {p.image ? (
                <img
                  src={`data:image/jpeg;base64,${p.image}`}
                  alt={p.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex justify-center items-center text-gray-500">
                  No Image
                </div>
              )}
              <div>
                <h2 className="font-semibold text-gray-800">{p.name}</h2>
                <p className="text-gray-600">₹{p.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
          />
          <input
            type="number"
            placeholder="Enter pin code"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handlePlaceOrder}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

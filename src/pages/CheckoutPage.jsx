import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getCart, emptyCart } from "../services/cartApi";
import { placeOrder, placeMultipleOrders } from "../services/orderApi";

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

    productId ? fetchSingleProduct(productId) : fetchCartProducts();
  }, [email, productId]);

  const fetchSingleProduct = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/products/find-by-id/${id}`);
      setProducts([res.data]);
    } catch (err) {
      console.error("Product fetch failed:", err);
      alert("Failed to load product details.");
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
      console.error("Cart fetch failed:", err);
      alert("Failed to load cart products.");
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
      if (products.length === 0) {
        alert("No products found to order.");
        return;
      }

      if (products.length > 1) {
        const orders = products.map((p) => ({
          productId: p.id,
          userEmail: email,
          orderStatus: "PLACED",
          address,
          pinCode: parseInt(pinCode),
          productName: p.name,
          totalPrice: p.price,
        }));

        console.log("Multiple orders:", orders);
        await placeMultipleOrders(orders);
      } else {
        const p = products[0];
        const order = {
          productId: p.id,
          userEmail: email,
          orderStatus: "PLACED",
          address,
          pinCode: parseInt(pinCode),
          productName: p.name,
          totalPrice: p.price,
        };

        console.log("Single order:", order);
        await placeOrder(order);
      }

      if (!productId) await emptyCart(email);

      alert("Order placed successfully! Check your email for confirmation.");
      navigate("/orders");
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Failed to place order. Please try again later.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-700">Loading checkout...</p>
    );

  if (products.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        No products to checkout.
      </p>
    );

  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-4 sm:px-6 lg:px-10 py-10 flex justify-center">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Section: Order Summary */}
        <div className="p-8 lg:p-10 bg-gray-50 border-r border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition"
              >
                {p.image ? (
                  <img
                    src={`data:image/jpeg;base64,${p.image}`}
                    alt={p.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex justify-center items-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-gray-600 text-sm">₹{p.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between text-lg font-semibold text-gray-800">
            <span>Total:</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        {/* Right Section: Delivery + Payment */}
        <div className="p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Delivery Details
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
              />
              <input
                type="number"
                placeholder="Enter pin code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
              />
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                {["Credit / Debit Card", "UPI / NetBanking", "Cash on Delivery"].map(
                  (method, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-400 transition"
                    >
                      <input type="radio" name="payment" defaultChecked={i === 0} />
                      <span className="text-gray-700">{method}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={handlePlaceOrder}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition text-lg"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

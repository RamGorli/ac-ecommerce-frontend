
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCart, emptyCart } from "../services/cartApi";
import { placeOrder, placeMultipleOrders } from "../services/orderApi";
import { fetchProductById } from "../services/productApi";


const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const singleProductId = location.state?.productId || null;
  const cartItems = location.state?.items || null;
  const guest = location.state?.guest || false;

  const [products, setProducts] = useState([]);
  const [userEmail, setUserEmail] = useState(email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [deliveryType, setDeliveryType] = useState("STANDARD");
  const [installation, setInstallation] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!email && !guest) {
      alert("Please log in to continue.");
      navigate("/login");
      return;
    }

    if (cartItems) {
      setProducts(cartItems);
      setLoading(false);
    } else if (singleProductId) {
      fetchSingleProduct(singleProductId);
    } else if (guest) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      if (!guestCart.length) {
        alert("No products in guest cart.");
        navigate("/cart");
      } else {
        setProducts(guestCart);
        setLoading(false);
      }
    } else {
      alert("No products to checkout.");
      navigate("/cart");
    }
  }, [email, singleProductId, cartItems, guest, navigate]);

  const fetchSingleProduct = async (id) => {
    try {
      setLoading(true);
      const product = await fetchProductById(id);
      setProducts([
        {
          ...product,
          quantity: location.state?.quantity || 1,
        },
      ]);
    } catch (err) {
      console.error("Failed loading product:", err);
      alert("Failed to load product.");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (placingOrder) return;
    setPlacingOrder(true);

    if (!address || !pinCode) {
      alert("Please enter delivery address and pin code.");
      return;
    }
    if (!phone || phone.trim().length === 0) {
      alert("Please enter a phone number (required).");
      return;
    }

    const finalEmail = userEmail.trim() !== "" ? userEmail.trim() : email;
    if (!finalEmail && !guest) {
      alert("Please provide an email to place order.");
      return;
    }

    if (guest && finalEmail) {
      localStorage.setItem("guestEmail", finalEmail);
    }

    try {
      const deliveryCost = deliveryType === "EXPRESS" ? 75 : 35;
      const installationCost = installation ? 50 : 0;

      const orders = products.map((p) => ({
        productId: p.id,
        userEmail: finalEmail,
        productName: p.name,
        productPrice: p.price,
        quantity: p.quantity,
        totalPrice: p.price * p.quantity + deliveryCost + installationCost,
        orderStatus: "PLACED",
        deliveryType,
        needInstallment: installation,
        address,
        phoneNumber: phone,
        pinCode: parseInt(pinCode, 10),
      }));

      if (orders.length === 1) {
        await placeOrder(orders[0]);
      } else {
        await placeMultipleOrders(orders);
      }

      if (!guest) await emptyCart(email);
      else localStorage.removeItem("guestCart");

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Failed to place order. See console for details.");
    } finally{
      setPlacingOrder(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading checkout...</p>;

  if (products.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600">
        No products available to checkout.
      </p>
    );

  const today = new Date();
  const addDays = (days) => {
    const d = new Date();
    d.setDate(today.getDate() + days);
    return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const estimate =
    deliveryType === "STANDARD"
      ? `${addDays(5)} — ${addDays(6)} (Standard delivery)`
      : `${addDays(2)} — ${addDays(3)} (Express delivery)`;

  const deliveryCost = deliveryType === "EXPRESS" ? 75 : 35;
  const installationCost = installation ? 50 : 0;
  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const total = subtotal + deliveryCost + installationCost;

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10 flex justify-center">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* ORDER SUMMARY */}
        <div className="p-8 bg-gray-50 border-r border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-3 bg-white rounded-xl shadow">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-20 h-20 object-cover rounded-lg" />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-500">
                    {p.brand && <span className="mr-1">{p.brand} •</span>}
                    {p.type} • {p.capacity || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    AUD ${p.price} × {p.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-lg font-semibold flex justify-between">
            <span>Subtotal</span>
            <span>AUD ${subtotal}</span>
          </div>

          <div className="mt-2 text-lg font-semibold flex justify-between">
            <span>Delivery</span>
            <span>AUD ${deliveryCost}</span>
          </div>

          {installation && (
            <div className="mt-2 text-lg font-semibold flex justify-between">
              <span>Installation</span>
              <span>AUD ${installationCost}</span>
            </div>
          )}

          <div className="mt-4 text-blue-700 font-medium text-md bg-blue-50 p-3 rounded-lg">
            <span className="block text-gray-700">Estimated Delivery</span>
            <b className="text-lg">{estimate}</b>
            <div className="text-sm text-gray-500 mt-1">Fast & reliable shipping 🚚</div>
          </div>

          <div className="mt-4 border-t pt-4 text-xl font-bold flex justify-between">
            <span>Total</span>
            <span>AUD ${total}</span>
          </div>
        </div>

        {/* DELIVERY DETAILS & PAYMENT */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>

            {!email && guest && (
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg mb-4"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            )}

            <input
              type="text"
              placeholder="Phone number (required)"
              className="w-full p-3 border rounded-lg mb-4"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter delivery address"
              className="w-full p-3 border rounded-lg mb-4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input
              type="number"
              placeholder="Enter post code"
              className="w-full p-3 border rounded-lg mb-8"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />

            <h3 className="text-xl font-semibold mb-2">Delivery Type</h3>
            <div className="flex gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded-lg border ${deliveryType === "STANDARD" ? "bg-blue-100 border-blue-400" : ""}`}
                onClick={() => setDeliveryType("STANDARD")}
              >
                Standard (AUD $35)
              </button>
              <button
                className={`px-4 py-2 rounded-lg border ${deliveryType === "EXPRESS" ? "bg-blue-100 border-blue-400" : ""}`}
                onClick={() => setDeliveryType("EXPRESS")}
              >
                Express (AUD $75)
              </button>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <input
                type="checkbox"
                checked={installation}
                onChange={() => setInstallation(!installation)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700">
                Add Installation Service (AUD $50)
              </label>
            </div>

            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <p className="text-sm text-gray-500 mb-3">All transactions are secure and encrypted.</p>

            <div className="border rounded-lg p-4 mb-6">
              <p><span className="font-semibold">Account Name:</span> AirXSolar Pty Ltd</p>
              <p><span className="font-semibold">BSB:</span> 123 123</p>
              <p><span className="font-semibold">Account Number:</span> 2152 2551</p>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-700">I confirm my address is within 65 km.</label>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={!agree || placingOrder}
            className={`w-full py-3 rounded-xl font-semibold text-lg transition 
              ${!agree || placingOrder 
                ? "bg-gray-300 text-gray-400 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
              }`}
          >
            {placingOrder ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

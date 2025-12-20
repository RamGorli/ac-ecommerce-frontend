import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    localStorage.getItem("email") ||
    localStorage.getItem("guestEmail");

  useEffect(() => {
    // Prevent direct access without placing order
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-6 sm:p-8">

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
          Order Placed Successfully!
        </h1>

        <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
          Thank you for shopping with us 🎉
        </p>

        {/* EMAIL INFO */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm sm:text-base">
          <p className="font-medium text-gray-800 mb-1">
            📧 Order Confirmation
          </p>
          <p className="text-gray-600">
            Your order details have been sent to:
            <br />
            <span className="font-semibold text-gray-800">{email}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Please check your inbox and spam/junk folder.
          </p>
        </div>

        {/* PAYMENT DETAILS */}
        <div className="border rounded-xl p-4 mb-6 text-sm sm:text-base">
          <h2 className="font-semibold text-gray-800 mb-2">
            💳 Payment Reminder
          </h2>

          <p className="text-gray-600 mb-3">
            If you haven’t completed the payment yet, please use the bank details
            below:
          </p>

          <div className="space-y-1 text-gray-700">
            <p>
              <span className="font-semibold">Account Name:</span>{" "}
              UR GROUP SOLUTIONS PTY LTD
            </p>
            <p>
              <span className="font-semibold">BSB:</span> 016080
            </p>
            <p>
              <span className="font-semibold">Account Number:</span> 802410917
            </p>
          </div>

          <div className="mt-3 text-xs sm:text-sm text-gray-500">
            ⏳ Your order will be processed after payment confirmation.
          </div>
        </div>

        {/* SCREENSHOT INSTRUCTION */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-6 text-sm sm:text-base">
          <p className="font-medium text-gray-800 mb-1">
            📸 Payment Proof Required
          </p>
          <p className="text-gray-600">
            After completing the payment, please send the payment screenshot to:
          </p>
          <a
            href="mailto:admin@airxsolar.com.au?subject=Payment%20Proof%20for%20Order"
            className="font-semibold text-blue-600 mt-1 inline-block hover:underline"
          >
            admin@airxsolar.com.au
          </a>
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

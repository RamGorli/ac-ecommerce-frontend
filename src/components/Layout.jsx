
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  // ✅ Function to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200
 text-slate-800">
      {/* Top delivery notice */}
      <div className="bg-blue-100 text-blue-900 text-center py-2 px-3 text-sm sm:text-base font-medium shadow-sm">
        🚚 For deliveries over 45km, please send a request to{" "}
        <a
          href="mailto:support@coolair.com"
          className="underline font-semibold hover:text-blue-600 transition"
        >
          support@AirXSolar.com
        </a>
        .
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <img
              src="/logo.png"
              alt="AirXSolar Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain bg-white p-1 rounded-lg border border-blue-300 shadow-md"
            />
            <span className="text-blue-300">AirXSolar</span>
          </Link>


          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md px-2"
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Navigation */}
          <nav
            className={`${
              menuOpen
                ? "flex flex-col absolute top-16 left-0 w-full bg-blue-800/95 shadow-lg sm:shadow-none sm:static sm:flex-row"
                : "hidden sm:flex"
            } sm:items-center sm:gap-5 gap-3 px-6 sm:px-0 py-4 sm:py-0 transition-all`}
          >
            {/* Public links */}
            <Link
              to="/products"
              className={`px-4 py-2 rounded-full border border-blue-300 text-center transition ${
                isActive("/products")
                  ? "bg-white text-blue-900 font-semibold scale-105"
                  : "hover:bg-blue-300 hover:text-blue-900"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>

            <Link
              to="/contact"
              className={`px-4 py-2 rounded-full border border-blue-300 text-center transition ${
                isActive("/contact")
                  ? "bg-white text-blue-900 font-semibold scale-105"
                  : "hover:bg-blue-300 hover:text-blue-900"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Quote & Contact
            </Link>

            {user ? (
              <>
                <Link
                  to="/orders"
                  className={`px-4 py-2 rounded-full border border-blue-300 text-center transition ${
                    isActive("/orders")
                      ? "bg-white text-blue-900 font-semibold scale-105"
                      : "hover:bg-blue-300 hover:text-blue-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Orders
                </Link>

                <Link
                  to="/cart"
                  className={`px-4 py-2 rounded-full border border-blue-300 text-center transition ${
                    isActive("/cart")
                      ? "bg-white text-blue-900 font-semibold scale-105"
                      : "hover:bg-blue-300 hover:text-blue-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Cart
                </Link>

                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-full border border-blue-300 text-center transition ${
                    isActive("/profile")
                      ? "bg-white text-blue-900 font-semibold scale-105"
                      : "hover:bg-blue-300 hover:text-blue-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full border border-blue-300 hover:bg-blue-300 hover:text-blue-900 transition text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-full border border-blue-300 text-center transition ${
                    isActive("/login")
                      ? "bg-white text-blue-900 font-semibold scale-105"
                      : "hover:bg-blue-300 hover:text-blue-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-full border border-blue-300 text-center transition ${
                    isActive("/signup")
                      ? "bg-white text-blue-900 font-semibold scale-105"
                      : "hover:bg-blue-300 hover:text-blue-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-100 text-center py-3 mt-auto shadow-inner">
        <p className="text-xs sm:text-sm font-light px-3">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">AirXSolar</span> — Stay Cool with Comfort.
        </p>
      </footer>
    </div>
  );
}

export default Layout;


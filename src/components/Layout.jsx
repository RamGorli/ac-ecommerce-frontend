import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-white to-blue-200 text-slate-800">
      {/* Top delivery notice */}
      <div className="bg-blue-100 text-blue-900 text-center py-1 px-1 text-sm sm:text-base font-medium shadow-sm">
        🚚 For deliveries over 45km, please send a request to{" "}
        <a
          href="mailto:support@coolair.com"
          className="underline font-semibold hover:text-blue-600 transition"
        >
          support@coolair.com
        </a>
        .
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <span>❄️</span>
            <span className="text-blue-300">CoolAir</span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-3 sm:gap-5 justify-center sm:justify-end font-medium">
            <Link
              to="/products"
              className="px-4 py-2 rounded-full border border-blue-300 hover:bg-blue-300 hover:text-blue-900 transition"
            >
              Products
            </Link>

            {user ? (
              <>
                <Link
                  to="/orders"
                  className="px-4 py-2 rounded-full border border-blue-300 hover:bg-blue-300 hover:text-blue-900 transition"
                >
                  Orders
                </Link>
                <Link
                  to="/cart"
                  className="px-4 py-2 rounded-full border border-blue-300 hover:bg-blue-300 hover:text-blue-900 transition"
                >
                  Cart
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-full border border-blue-300 hover:bg-blue-300 hover:text-blue-900 transition"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full border border-blue-300 hover:bg-blue-300 hover:text-blue-900 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full border border-blue-300 hover:bg-blue-300 hover:text-blue-900 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full border border-blue-300 hover:bg-blue-300 hover:text-blue-900 transition"
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
      <footer className="bg-blue-950 text-blue-100 text-center py-6 mt-auto shadow-inner">
        <p className="text-sm sm:text-base font-light">
          © {new Date().getFullYear()} <span className="font-semibold">CoolAir</span> — Stay Cool with Comfort.
        </p>
      </footer>
    </div>
  );
}

export default Layout;



// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// function Layout() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-800">
//       {/* Top delivery notice */}
//       <div className="bg-blue-50 text-blue-800 text-center py-1 px-1 text-sm sm:text-base font-medium shadow-sm">
//         🚚 For deliveries over 45km, please send a request to{" "}
//         <a
//           href="mailto:support@coolair.com"
//           className="underline font-semibold hover:text-blue-600 transition"
//         >
//           support@coolair.com
//         </a>
//         .
//       </div>

//       {/* Header */}
//       <header className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 text-white shadow-md sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
//           {/* Logo */}
//           <Link
//             to="/"
//             className="text-3xl font-extrabold tracking-tight flex items-center gap-2 hover:scale-105 transition-transform"
//           >
//             <span>❄️</span>
//             <span className="text-blue-100">CoolAir</span>
//           </Link>

//           {/* Navigation */}
//           <nav className="flex flex-wrap gap-3 sm:gap-5 justify-center sm:justify-end font-medium">
//             <Link
//               to="/products"
//               className="px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-200 hover:text-blue-900 transition"
//             >
//               Products
//             </Link>

//             {user ? (
//               <>
//                 <Link
//                   to="/orders"
//                   className="px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-200 hover:text-blue-900 transition"
//                 >
//                   Orders
//                 </Link>
//                 <Link
//                   to="/cart"
//                   className="px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-200 hover:text-blue-900 transition"
//                 >
//                   Cart
//                 </Link>
//                 <Link
//                   to="/profile"
//                   className="px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-200 hover:text-blue-900 transition"
//                 >
//                   Profile
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-200 hover:text-blue-900 transition"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-200 hover:text-blue-900 transition"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-200 hover:text-blue-900 transition"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </nav>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-grow px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
//         <Outlet />
//       </main>

//       {/* Footer */}
//       <footer className="bg-blue-100 text-blue-800 text-center py-6 mt-auto shadow-inner">
//         <p className="text-sm sm:text-base font-light">
//           © {new Date().getFullYear()}{" "}
//           <span className="font-semibold">CoolAir</span> — Stay Cool with Comfort.
//         </p>
//       </footer>
//     </div>
//   );
// }

// export default Layout;

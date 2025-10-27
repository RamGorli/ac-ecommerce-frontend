// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// const AdminLayout = () => {
//   const { logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-white to-blue-200">
//       <header className="bg-blue-900 text-white py-4 shadow-md sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
//           <h1 className="text-2xl font-bold">Admin Panel</h1>
//           <nav className="flex gap-4">
//             <Link to="/admin/products" className="hover:text-blue-300">
//               Product Management
//             </Link>
//             <Link to="/admin/orders" className="hover:text-blue-300">
//               Order Management
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="bg-red-600 px-4 py-1 rounded-lg hover:bg-red-700"
//             >
//               Logout
//             </button>
//           </nav>
//         </div>
//       </header>

//       <main className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
//         <Outlet />
//       </main>

//       <footer className="bg-blue-950 text-blue-100 text-center py-6 mt-auto shadow-inner">
//         <p>© {new Date().getFullYear()} CoolAir Admin — Control Center</p>
//       </footer>
//     </div>
//   );
// };

// export default AdminLayout;

import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/admin/products", label: "Product Management" },
    { path: "/admin/orders", label: "Order Management" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-white to-blue-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
            Admin Panel
          </h1>

          {/* Navigation Buttons */}
          <nav className="flex flex-wrap gap-3 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-xl font-medium text-sm sm:text-base shadow-md transition-all
                  ${
                    location.pathname === item.path
                      ? "bg-white text-blue-900 font-semibold scale-105"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
              >
                {item.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-md transition-all"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-100 text-center py-6 mt-auto shadow-inner">
        <p>© {new Date().getFullYear()} CoolAir Admin — Control Center</p>
      </footer>
    </div>
  );
};

export default AdminLayout;

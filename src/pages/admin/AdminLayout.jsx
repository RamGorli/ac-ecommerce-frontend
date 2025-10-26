import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-white to-blue-200">
      <header className="bg-blue-900 text-white py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <nav className="flex gap-4">
            <Link to="/admin/products" className="hover:text-blue-300">
              Product Management
            </Link>
            <Link to="/admin/orders" className="hover:text-blue-300">
              Order Management
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-1 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      <footer className="bg-blue-950 text-blue-100 text-center py-6 mt-auto shadow-inner">
        <p>© {new Date().getFullYear()} CoolAir Admin — Control Center</p>
      </footer>
    </div>
  );
};

export default AdminLayout;

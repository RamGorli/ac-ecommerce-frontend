
// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login.jsx";
// import Signup from "./pages/Signup.jsx";
// import Home from "./pages/Home.jsx";
// import Layout from "./components/Layout.jsx"; 
// import Profile from "./pages/Profile.jsx";
// import Cart from "./pages/Cart.jsx";
// import Contact from "./pages/Contact.jsx";
// import ProductDetails from "./pages/ProductDetails.jsx";
// import Orders from "./pages/Orders.jsx";
// import Products from "./pages/Products.jsx";

// // Admin imports
// import AdminRoute from "./components/AdminRoute";
// import AdminLayout from "./pages/admin/AdminLayout";
// import ProductManagement from "./pages/admin/ProductManagement";
// import OrderManagement from "./pages/admin/OrderManagement";

// import "./index.css";

// function App() {
//   return (
//     <Routes>
//       {/* User-facing routes */}
//       <Route element={<Layout />}>
//         <Route path="/" element={<Home />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/products/:id" element={<ProductDetails />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/orders" element={<Orders />} />
//         <Route path="/contact" element={<Contact />} />
//       </Route>

//       {/* Authentication routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />

//       {/* Admin routes */}
//       <Route
//         path="/admin"
//         element={
//           <AdminRoute>
//             <AdminLayout />
//           </AdminRoute>
//         }
//       >
//         <Route path="products" element={<ProductManagement />} />
//         <Route path="orders" element={<OrderManagement />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Layout from "./components/Layout.jsx";
import Profile from "./pages/Profile.jsx";
import Cart from "./pages/Cart.jsx";
import Contact from "./pages/Contact.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Orders from "./pages/Orders.jsx";
import Products from "./pages/Products.jsx";

// Admin imports
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";

import "./index.css";

function App() {
  return (
    <Routes>

          {/* Admin routes (protected) */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
      </Route>

      {/* User-facing routes */}
      <Route path="/*" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<Orders />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Authentication routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />


    </Routes>
  );
}

export default App;

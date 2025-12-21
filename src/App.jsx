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
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AddReview from "./pages/AddReview.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";

import AdminRoute from "./components/AdminRoute.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import ProductManagement from "./pages/admin/ProductManagement.jsx";
import OrderManagement from "./pages/admin/OrderManagement.jsx";
import ReviewManagement from "./pages/admin/ReviewManagement.jsx";

import "./index.css";

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<ProductManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="reviews" element={<ReviewManagement />} />
      </Route>

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="contact" element={<Contact />} />
        <Route path="add-review" element={<AddReview />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;






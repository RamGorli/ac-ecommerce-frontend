import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Layout from "./components/Layout.jsx"; 
import Profile from "./pages/Profile.jsx"
import Cart from "./pages/Cart.jsx"
import Contact from "./pages/Contact.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";

import "./index.css";
import Orders from "./pages/Orders.jsx";
import Products from "./pages/Products.jsx";
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<Contact/>}/>
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

    </Routes>
  );
}

export default App;

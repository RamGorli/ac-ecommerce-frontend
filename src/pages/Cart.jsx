import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, emptyCart } from "../services/cartApi";
import api from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const email = localStorage.getItem("email"); // make sure email exists

  useEffect(() => {
    if (email) fetchCart();
  }, [email]);

  const fetchCart = async () => {
    try {
      if (!email) return;

      const { cart } = await getCart(email);
      setCart(cart);

      // Fetch full product details using correct API route
      const productData = await Promise.all(
        cart.map((id) =>
          api.get(`/products/find-by-id/${id}`).then((res) => res.data)
        )
      );
      setProducts(productData);
    } catch (error) {
      console.error("Error loading cart:", error);
      alert("Error loading cart. Please try again.");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(email, productId);
      alert("Product removed");
      fetchCart();
    } catch (error) {
      console.error(error);
      alert("Failed to remove product");
    }
  };

  const handleEmpty = async () => {
    try {
      await emptyCart(email);
      alert("Cart cleared");
      fetchCart();
    } catch (error) {
      console.error(error);
      alert("Failed to clear cart");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Cart</h2>

      {products.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {products.map((p) => (
              <li key={p.id} style={{ marginBottom: "10px" }}>
                <img
                  src={p.image ? `https://e-commerce-cndv.onrender.com${p.image}` : ""}
                  alt={p.name}
                  width="80"
                />
                <span style={{ marginLeft: "10px" }}>
                  {p.name} - ₹{p.price}
                </span>
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleRemove(p.id)}
                >
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleEmpty}>🗑️ Empty Cart</button>
        </>
      )}
    </div>
  );
};

export default Cart;

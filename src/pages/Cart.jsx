import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, emptyCart } from "../services/cartApi";
import api from "../services/api";
const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { cart } = await getCart(email);
      setCart(cart);
      // Fetch full product details using product IDs
      const productData = await Promise.all(
        cart.map((id) => api.get(`/product/${id}`).then((res) => res.data))
      );
      setProducts(productData);
    } catch (error) {
      alert("Error loading cart"+error);
    }
  };

  const handleRemove = async (productId) => {
    await removeFromCart(email, productId);
    alert("Product removed");
    fetchCart();
  };

  const handleEmpty = async () => {
    await emptyCart(email);
    alert("Cart cleared");
    fetchCart();
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
                <img src={p.imageUrl} alt={p.name} width="80" />
                <span style={{ marginLeft: "10px" }}>{p.name} - ₹{p.price}</span>
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

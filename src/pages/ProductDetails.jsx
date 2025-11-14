import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { addToCart } from "../services/cartApi";
import { fetchAllProducts } from "../services/productApi";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const convertImage = (p) => {
    if (p.image) {
      const binary = Uint8Array.from(p.image);
      let base64 = "";
      for (let i = 0; i < binary.length; i++)
        base64 += String.fromCharCode(binary[i]);
      return { ...p, imageBase64: `data:image/jpeg;base64,${btoa(base64)}` };
    }
    return p;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // fetch main product
      const res = await api.get(`/products/find-by-id/${id}`);
      setProduct(res.data);

      // fetch all others to show related
      let all = await fetchAllProducts();
      all = all.map(convertImage);

      let related = all.filter((p) => p.type === res.data.type && p.id !== res.data.id);

      if (related.length < 4) {
        const extra = all
          .filter((p) => p.id !== res.data.id)
          .slice(0, 4 - related.length);
        related = [...related, ...extra];
      }

      setRelatedProducts(related.slice(0, 4));
      setLoading(false);
    };

    load();
  }, [id]);

  const handleAddToCart = async () => {
    const email = localStorage.getItem("email");
    if (!email) return alert("Please login first");

    await addToCart(email, product.id);

    let qtyStore = JSON.parse(localStorage.getItem("cartQuantities") || "{}");
    qtyStore[product.id] = (qtyStore[product.id] || 0) + quantity;
    localStorage.setItem("cartQuantities", JSON.stringify(qtyStore));

    alert(`${product.name} added to cart`);
  };

  const handleOrderNow = () => {
    const email = localStorage.getItem("email");
    if (!email) return alert("Please login first");

    navigate("/checkout", { state: { productId: product.id, quantity } });
  };

  if (loading)
    return <p className="text-center mt-10">Loading...</p>;

  if (!product)
    return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg flex gap-8">
        
        <div className="flex-1">
          {product.image ? (
            <img
              src={`data:image/jpeg;base64,${product.image}`}
              className="w-full h-96 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
              No Image
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 text-lg">
            Type: {product.type}
          </p>
          <p>{product.description}</p>
          <p className="text-3xl font-bold text-blue-600">
            ₹{product.price}
          </p>

          <div className="flex items-center gap-4 mt-3">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 bg-gray-200 rounded-lg">-</button>
            <span className="text-xl">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 bg-gray-200 rounded-lg">+</button>
          </div>

          <div className="flex gap-4 pt-5">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg"
            >
              Add to Cart
            </button>
            <button
              onClick={handleOrderNow}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer"
              >
                <img src={p.imageBase64} className="w-full h-40 object-cover rounded-lg mb-3" />
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-gray-700">₹{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductDetails;

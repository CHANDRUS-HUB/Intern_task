import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Backend URL

const ProductDetails = () => {
  const [products, setProducts] = useState([]);

  // 🔄 Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Product Details</h2>

      {/* 🛑 Show message if no products exist */}
      {products.length === 0 ? (
        <p className="text-gray-500">No products found. Add new products.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Old Stock</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Consumed</th>
              <th className="border p-2">In Hand Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="text-center">
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.category}</td>
                <td className="border p-2">{product.oldStock ?? 0}</td>
                <td className="border p-2">{product.quantity ?? 0}</td>
                <td className="border p-2">{product.unit}</td>
                <td className="border p-2">{product.consumed ?? 0}</td>
                <td className="border p-2">{product.in_hand_stock ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductDetails;

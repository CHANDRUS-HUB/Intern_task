import { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../URL/url";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseurl}/products`);
      console.log("Fetched Products:", res.data);

      // Remove duplicates & sort by latest date
      const uniqueProducts = res.data
        .filter((value, index, self) => index === self.findIndex((p) => p.id === value.id))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setProducts(uniqueProducts);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Product List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Old Stock</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Consumed</th>
              <th className="border p-2">In-Hand Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="border p-4 text-center text-gray-500">
                  No products available.
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id || index} className="border hover:bg-gray-100">
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">{product.category_name || "N/A"}</td>
                  <td className="border p-2">{new Date(product.date).toLocaleDateString()}</td>
                  <td className="border p-2">{product.old_stock}</td>
                  <td className="border p-2">{product.quantity}</td>
                  <td className="border p-2 text-red-500">{product.consumed}</td>
                  <td className={`border p-2 ${product.in_hand_stock > 0 ? "text-green-500" : "text-red-500"}`}>
                    {product.in_hand_stock}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;

import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productApi"; // ✅ Import API function

const ViewDetails = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(); // ✅ Call API function
        console.log("✅ Fetched products:", data); // ✅ Debugging Log
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        setError("Failed to load products. Please check the backend.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Product Details</h2>

      {loading && <p className="text-center text-gray-500">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {products.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Old Stock</th>
              <th className="border p-2">New Stock</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Consumed</th>
              <th className="border p-2">In-Hand Stock</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="bg-white font-semibold">
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.category || "N/A"}</td>
                <td className="border p-2">{product.old_stock ?? 0}</td>
                <td className="border p-2">{product.new_stock ?? 0}</td>
                <td className="border p-2">{product.unit || "N/A"}</td>
                <td className="border p-2">{product.consumed ?? 0}</td>
                <td className="border p-2">{product.in_hand_stock ?? 0}</td>
                <td className="border p-2">
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-center text-gray-500">No products available.</p>
      )}
    </div>
  );
};

export default ViewDetails;

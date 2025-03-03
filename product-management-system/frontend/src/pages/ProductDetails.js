import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productApi";

const ViewDetails = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        console.log("Fetched products:", data);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please check the backend.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Product Details</h2>

      {loading && <p className="text-center text-gray-500">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-purple-600 text-white text-left">
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Old Stock</th>
                <th className="p-3">New Stock</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Consumed</th>
                <th className="p-3">In-Hand Stock</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr 
                  key={product._id} 
                  className={`text-gray-700 text-center ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition`}
                >
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category || "N/A"}</td>
                  <td className="p-3">{product.old_stock ?? 0}</td>
                  <td className="p-3">{product.new_stock ?? 0}</td>
                  <td className="p-3">{product.unit || "N/A"}</td>
                  <td className="p-3">{product.consumed ?? 0}</td>
                  <td className="p-3">{product.in_hand_stock ?? 0}</td>
                  <td className="p-3">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-center text-gray-500">No products available.</p>
      )}
    </div>
  );
};

export default ViewDetails;

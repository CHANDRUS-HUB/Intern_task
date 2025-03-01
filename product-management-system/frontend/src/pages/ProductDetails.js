import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productApi";

const ViewDetails = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        console.log("Fetched products:", data); 
        setProducts(data || []);
      } catch (error) {
        console.error(" Error fetching products:", error);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Product Details</h2>

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
            <th className="border p-2">Date</th> {/* ✅ New Date Column */}
          </tr>
        </thead>
        <tbody>
          {products?.length > 0 ? (
            products.map((product) => (
              <tr key={product._id} className="bg-white font-semibold">
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.category}</td>
                <td className="border p-2">{product.old_stock}</td>
                <td className="border p-2">{product.new_stock !== null ? product.new_stock : 0}</td> 
                <td className="border p-2">{product.unit}</td>
                <td className="border p-2">{product.consumed}</td>
                <td className="border p-2">{product.in_hand_stock}</td>
                <td className="border p-2">
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"} {/* ✅ Fix Invalid Date */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewDetails;

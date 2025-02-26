import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseurl } from "../URL/url";

function DailyConsumption() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [consumptions, setConsumptions] = useState({});

  // ✅ Predefined category options
  const categoryOptions = ["Dairy Prouducts", "Canteen", "Stationary", "Washroom", "Office Products ", "Fruits", "Snacks"];

  const fetchProducts = useCallback(async () => {
    if (!selectedCategory) return;
    try {
      const res = await axios.get(`${baseurl}/products?category=${selectedCategory}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleConsumptionChange = (productId, value) => {
    const newValue = Math.max(0, Number(value));

    setConsumptions((prev) => ({
      ...prev,
      [productId]: newValue,
    }));

    // ✅ Auto-update in_hand_stock
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, in_hand_stock: product.old_stock + product.quantity - newValue }
          : product
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      alert("⚠️ Please select a category!");
      return;
    }

    const updates = Object.entries(consumptions).map(([productId, consumed]) => ({
      productId: parseInt(productId),
      consumed: parseInt(consumed),
    }));

    if (updates.length === 0) {
      alert("⚠️ No consumption records to update.");
      return;
    }

    try {
      await axios.put(`${baseurl}/update-consumption`, { updates });
      alert("✅ Consumption recorded successfully!");
      fetchProducts();
      setConsumptions({});
    } catch (error) {
      console.error("❌ Error updating consumption:", error);
      alert("Failed to update consumption. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Daily Consumption</h2>

      {/* ✅ Predefined Category Selection */}
      <select
        required
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Category</option>
        {categoryOptions.map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>

      {products.length > 0 ? (
        <table className="w-full border mt-6">
          <thead>
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Old Stock</th>
              <th className="border p-2">In-Hand</th>
              <th className="border p-2">Consume</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{Number(product.old_stock) || 0}</td>
                <td className="border p-2">{Number(product.in_hand_stock) || 0}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    min="0"
                    value={consumptions[product.id] || ""}
                    onChange={(e) => handleConsumptionChange(product.id, e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-4 text-gray-500">No products available for this category.</p>
      )}

      <button
        onClick={handleSubmit}
        className="w-full p-2 bg-green-500 text-white rounded mt-4"
      >
        Save Consumption
      </button>
    </div>
  );
}

export default DailyConsumption;

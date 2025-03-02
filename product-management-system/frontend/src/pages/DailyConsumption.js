import { useState, useEffect } from "react";
import { getProductByName, updateProduct } from "../api/productApi";
import { toast } from "react-toastify";

const unitTypes = ["kg", "g", "liter", "ml", "package", "piece", "box", "dozen", "bottle", "can"];

const DailyConsumption = () => {
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("");
  const [oldStock, setOldStock] = useState(0);
  const [newStock, setNewStock] = useState("");
  const [consumed, setConsumed] = useState("");
  const [inHandStock, setInHandStock] = useState(0);

  // Fetch product details when product name changes
  useEffect(() => {
    if (productName.length > 2) { // ✅ Prevent searching for very short names
      getProductByName(productName)
        .then((data) => {
          if (data) {
            setOldStock(data.in_hand_stock || 0);
            setUnit(data.unit || "");
          } else {
            setOldStock(0);
            setUnit("");
          }
        })
        .catch(() => toast.error("❌ Error fetching product details."));
    }
  }, [productName]);
  
  // Recalculate in-hand stock when new stock or consumed stock changes
  useEffect(() => {
    const purchase = Number(newStock) || 0;
    const consumedQty = Number(consumed) || 0;
    setInHandStock(oldStock + purchase - consumedQty);
  }, [newStock, consumed, oldStock]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName) {
      return toast.error("❌ Please enter a product name.");
    }

    if (!unit) {
      return toast.error("❌ Please select a unit.");
    }

    if (Number(consumed) > oldStock + Number(newStock)) {
      return toast.error("❌ Consumed quantity cannot exceed available stock.");
    }

    const updateData = {
      newStock,
      unit,
      consumed,
    };

    console.log("📡 Sending update request:", { productName, updateData });

    try {
      const response = await updateProduct(productName, updateData);
      console.log("🟢 Update Response:", response);
      toast.success("✅ Stock updated successfully!");

      // Reset form fields
      setProductName("");
      setNewStock("");
      setConsumed("");
      setInHandStock(0);
    } catch (error) {
      console.error("❌ Update Failed:", error);
      toast.error(`⚠️ Error updating stock: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Daily Consumption</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="text-b text-gray-600"> Product Name</label>
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-2 border rounded mt-2"
          required
        />

        <label className="text-b text-gray-600 mt-2">Old Stock</label>
        <input type="number" name="oldStock" value={oldStock} readOnly className="w-full p-2 border rounded bg-gray-100" />

        <label className="text-b text-gray-600">New Stock Quantity</label>
        <input
          type="number"
          name="newStock"
          placeholder="New Stock Quantity"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <label className="text-b text-gray-600">Today's Consumption</label>
        <input
          type="number"
          name="consumed"
          placeholder="Today's Consumption"
          value={consumed}
          onChange={(e) => setConsumed(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <label className="text-b text-gray-600">Unit</label>
        <select name="unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="">Select Unit</option>
          {unitTypes.map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>

        <label className="text-b text-gray-600">In Hand Stock</label>
        <input type="number" name="inHandStock" value={inHandStock} readOnly className="w-full p-2 border rounded bg-gray-100" />

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Update Stock
        </button>
      </form>
    </div>
  );
};

export default DailyConsumption;

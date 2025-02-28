import { useState, useEffect } from "react";
import { updateProduct, getProductByNameAndCategory } from "../api/productApi";
import { toast } from "react-toastify";

const DailyConsumption = () => {
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [oldStock, setOldStock] = useState(0);  // Initial old stock state
  const [newStock, setNewStock] = useState("");
  const [consumed, setConsumed] = useState("");
  const [inHandStock, setInHandStock] = useState(0);

  // Fetch product details when category and product name are selected
  useEffect(() => {
    if (productName && category) {
      getProductByNameAndCategory(productName, category)
        .then((data) => {
          console.log("Fetched Product Data:", data);  // Log the data received from the backend
          if (data) {
            // Set the old stock value from the latest product record
            setOldStock(data.in_hand_stock || 0);
            setInHandStock(data.in_hand_stock || 0); // Set in-hand stock from the product data
          } else {
            setOldStock(0);  // Reset if product is not found
            setInHandStock(0); // Reset in-hand stock if no product found
          }
        })
        .catch((error) => {
          console.error("Error fetching product details:", error); // Log the error
          toast.error("Error fetching product details.");
          setOldStock(0);  // Reset old stock
          setInHandStock(0); // Reset in-hand stock on error
        });
    }
  }, [productName, category]);  // Triggered when category or product name changes
    // Triggered when category or product name changes

  // Recalculate in-hand stock when new stock or consumed stock changes
  useEffect(() => {
    // Ensure new stock and consumed are numbers and calculate in-hand stock
    const purchase = Number(newStock) || 0;
    const consumedQty = Number(consumed) || 0;
    setInHandStock(oldStock + purchase - consumedQty);  // Update in-hand stock dynamically
  }, [newStock, consumed, oldStock]);  // Only recalculate when one of these values changes

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !productName) {
      return toast.error("Please select a category and enter a product name.");
    }

    const updateData = {
      newStock: Number(newStock) || 0,  // Ensure numeric values
      consumed: Number(consumed) || 0
    };

    console.log("📡 Sending update request:", { productName, category, updateData });

    try {
      const response = await updateProduct(productName, category, updateData);
      console.log("🟢 Update Response:", response);
      toast.success("Stock updated successfully!");

      // Reset form fields after successful update
      setProductName("");
      setCategory("");
      setNewStock("");
      setConsumed("");
      setOldStock(0);  // Reset old stock field
      setInHandStock(0);  // Reset in-hand stock field
    } catch (error) {
      console.error("❌ Update Failed:", error);
      toast.error(`Error updating stock: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Daily Consumption</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Select */}
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        >
          <option value="">Select Category</option>
          <option value="Dairy">Dairy</option>
          <option value="Fruits">Fruits</option>
          <option value="Grains">Grains</option>
          <option value="Bakery">Bakery</option>
          <option value="Washroom">Washroom</option>
          <option value="Stationery">Stationery</option>
        </select>

        {/* Product Name Input */}
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

        {/* Old Stock (Auto populated when product is selected) */}
        <label className="text-b text-gray-600 mt-2 ">Old Stock</label>
        <input
          type="number"
          name="oldStock"
          value={oldStock}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />

        {/* New Stock Quantity Input */}
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

        {/* Today's Consumption Input */}
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

        {/* In Hand Stock (Calculated dynamically) */}
        <label className="text-b text-gray-600">In Hand Stock</label>
        <input
          type="number"
          name="inHandStock"
          value={inHandStock}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Update Stock
        </button>
      </form>
    </div>
  );
};

export default DailyConsumption;

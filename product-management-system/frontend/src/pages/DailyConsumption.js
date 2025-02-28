import { useState, useEffect } from "react";
import { getProductByName, updateProduct } from "../api/productApi";




import { toast } from "react-toastify";

const DailyConsumption = () => {
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [oldStock, setOldStock] = useState(0);
  const [newStock, setNewStock] = useState("");
  const [consumed, setConsumed] = useState("");
  const [inHandStock, setInHandStock] = useState(0);


  useEffect(() => {
    if (productName && category) {
      getProductByName(productName, category)
        .then((data) => {
          if (data) {
            setOldStock(data.in_hand_stock || 0);
          } else {
            setOldStock(0); 
          }
        })
        .catch(() => toast.error("Error fetching product details."));
    }
  }, [productName, category]);


  useEffect(() => {
    const purchase = Number(newStock) || 0;
    const consumedQty = Number(consumed) || 0;
    setInHandStock(oldStock + purchase - consumedQty);
  }, [newStock, consumed, oldStock]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!category || !productName) {
      return toast.error("Please select a category and enter a product name.");
    }
  
    if (isNaN(newStock) || isNaN(consumed) || newStock < 0 || consumed < 0) {
      return toast.error("Enter valid numerical values for stock.");
    }
  
    if (consumed > oldStock + Number(newStock)) {
      return toast.error("Consumed quantity cannot exceed available stock.");
    }
  
    
  try {
    const updatedStockData = {
      category,
      new_purchase: Number(newStock) || 0, // ✅ Ensure correct data type
      consumed: Number(consumed) || 0,     // ✅ Ensure correct data type
    };

    await updateProduct(productName, updatedStockData);
      toast.success("Stock updated successfully!");
  
      setProductName("");
      setNewStock("");
      setConsumed("");
      setOldStock(inHandStock);
    } catch (error) {
      toast.error("Error updating stock.");
    }
  };
  

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Daily Consumption</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      
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
        <label className="text-b text-gray-600 mt-2 ">Old Stock</label>
        <input
          type="number"
          name="oldStock"
          value={oldStock}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />

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

       <label className="text-b text-gray-600">Today Consumption</label>
        <input
          type="number"
          name="consumed"
          placeholder="Today's Consumption"
          value={consumed}
          onChange={(e) => setConsumed(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

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

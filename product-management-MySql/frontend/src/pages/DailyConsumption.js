import { useState, useEffect } from "react";
import { getProductByName, fetchProducts, updateProduct } from "../api/productApi";
import { toast } from "react-toastify";

const DailyConsumption = () => {
  const [name, setName] = useState(""); 
  const [products, setProducts] = useState([]); 
  const [unit, setUnit] = useState("");
  const [oldStock, setOldStock] = useState(0);
  const [newStock, setNewStock] = useState("");
  const [consumed, setConsumed] = useState("");
  const [inHandStock, setInHandStock] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); 

  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        if (Array.isArray(data)) {
         
          const uniqueProductNames = [...new Set(data.map((p) => p.name))];
          setProducts(uniqueProductNames);
        }
      } catch (error) {
        console.error("Error fetching product list:", error);
        toast.error("❌ Error fetching product list.");
      }
    };
    loadProducts();
  }, []);

 
  useEffect(() => {
    if (name.length > 2) { 
      getProductByName(name)
        .then((data) => {
          if (data) {
            setOldStock(data.in_hand_stock || 0);
            setUnit(data.unit || "");
          } else {
            setOldStock(0);
            setUnit("");
          }
        })
        .catch(() => toast.error(" Error fetching product details."));
    }
  }, [name]);

  
  useEffect(() => {
    const purchase = Number(newStock) || 0;
    const consumedQty = Number(consumed) || 0;
    setInHandStock(oldStock + purchase - consumedQty);
  }, [newStock, consumed, oldStock]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        toast.error(" Product name should only contain letters and spaces.");
        return;
      }
    }

    if ((name === "newStock" || name === "consumed") && (!/^\d*\.?\d*$/.test(value))) {
      toast.error(" Please enter a valid number.");
      return;
    }

    if (name === "name") setName(value);
    if (name === "newStock") setNewStock(value);
    if (name === "consumed") setConsumed(value);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error(" Please enter a product name.");
    }

    if (!unit) {
      return toast.error(" Please select a unit.");
    }

    if (Number(consumed) > oldStock + Number(newStock)) {
      return toast.error(" Consumed quantity cannot exceed available stock.");
    }

    const updateData = {
      newStock,
      unit,
      consumed,
    };

    console.log(" Sending update request:", { name, updateData });

    try {
      const response = await updateProduct(name, updateData);
      console.log("Update Response:", response);
      toast.success(" Stock updated successfully!");

      setName("");
      setNewStock("");
      setConsumed("");
      setInHandStock(0);
    } catch (error) {
      console.error(" Update Failed:", error);
      toast.error(` Error updating stock: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Daily Consumption</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
      

        
        <div>
          <label className="text-gray-700 font-medium">Select a Product</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
            onChange={(e) => setName(e.target.value)}
          >
            <option value="">Select a Product</option>
            {products
              .filter((product) => product.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((product, index) => (
                <option key={index} value={product}>
                  {product}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="text-gray-700 font-medium">Old Stock</label>
          <input 
            type="number" 
            name="oldStock" 
            value={oldStock} 
            readOnly 
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 shadow-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700 font-medium">New Stock Quantity</label>
            <input
              type="number"
              name="newStock"
              placeholder="Enter quantity"
              value={newStock}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Today's Consumption</label>
            <input
              type="number"
              name="consumed"
              placeholder="Enter consumed amount"
              value={consumed}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-gray-700 font-medium">Unit</label>
          <input 
            type="text" 
            name="unit"
            value={unit}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 shadow-sm"
          />
        </div>
        <div>
          <label className="text-gray-700 font-medium">In Hand Stock</label>
          <input 
            type="number" 
            name="oldStock" 
            value={inHandStock} 
            readOnly 
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 shadow-sm"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all"
        >
          Update Stock
        </button>
      </form>
    </div>
  );
};

export default DailyConsumption;

import { useState, useEffect, useCallback } from "react";
import { getProductByName, getProducts, updateProduct } from "../api/productApi";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

const DailyConsumption = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [oldStock, setOldStock] = useState(0);
  const [newStock, setNewStock] = useState("");
  const [consumed, setConsumed] = useState("");
  const [inHandStock, setInHandStock] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        if (Array.isArray(data)) {
          setProducts(data);
          setCategories([...new Set(data.map(p => p.category))]);
        }
      } catch (error) {
        toast.error("Error fetching product list.");
      }
    };
    loadProducts();
  }, []);

  const fetchProductDetails = useCallback(
    debounce(async (productName, productCategory) => {
      if (!productName || !productCategory) return;
      const matchingProducts = products.filter(p => p.name === productName && p.category === productCategory);
      
      if (matchingProducts.length) {
        setUnits([...new Set(matchingProducts.map(p => p.unit))]);
        if (!unit || !matchingProducts.some(p => p.unit === unit)) {
          setUnit(matchingProducts[0].unit);
        }
      }
    }, 500),
    [products]
  );

  useEffect(() => {
    if (name && category) fetchProductDetails(name, category);
  }, [name, category]);

  useEffect(() => {
    if (!name || !category || !unit) return; 

    const product = products.find(p => p.name === name && p.category === category && p.unit === unit);
    if (product) {
      setOldStock(product.in_hand_stock || 0);
      setInHandStock(product.in_hand_stock || 0);
    } else {
      setOldStock(0);
      setInHandStock(0);
    }
  }, [name, category, unit]);

  useEffect(() => {
    const purchase = Number(newStock) || 0;
    const consumedQty = Number(consumed) || 0;
    setInHandStock(oldStock + purchase - consumedQty);
  }, [newStock, consumed, oldStock]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setCategory(value);
      setUnits([]);
    }
    if (name === "name") {
      setName(value);
      setNewStock("");
      setConsumed("");
      setUnit("");
      setOldStock(0);
      setInHandStock(0);
    }
    if (name === "unit") {
      setUnit(value);
    }
    if (["newStock", "consumed"].includes(name)) {
      if (!/^\d*\.?\d*$/.test(value)) {
        return toast.error("Please enter a valid number.");
      }
      if (name === "newStock") setNewStock(value);
      if (name === "consumed") setConsumed(value);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  


    if ((!newStock || newStock.trim() === "") && (!consumed || consumed.trim() === "")) {
      return toast.error("Please enter either new stock or consumed quantity.");
    }
    
   
    if (Number(consumed) > (Number(oldStock) + Number(newStock))) {
      return toast.error("Consumed quantity cannot be greater than available stock.");
    }
    
    
    if (!name || !category || !unit) {
      return toast.error("Please select a valid product, category, and unit.");
    }
    const selectedProduct = products.find((p) => p.name === name) || null;

    if (selectedProduct && selectedProduct.category !== category) {
      return toast.error("Selected product does not match the selected category.");
    }
    
  
    const updateData = { new_stock: newStock, consumed };

    try {
      await updateProduct(name, category, unit, updateData);
        toast.success("Stock updated successfully!");


      setName("");
      setCategory("");
      setUnit("");
      setOldStock("")
      setNewStock("");
      setConsumed("");
      setInHandStock("");
    } catch (error) {
      toast.error(`Error updating stock: ${error.message}`);
    }
  };



  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Daily Consumption</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-gray-700 font-medium">Category</label>
          <select name="category" value={category} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="">Select Category</option>
            {categories.map((c, index) => (
              <option key={index} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Product Selection (Filtered by Category) */}
        <div>
          <label className="text-gray-700 font-medium">Select a Product</label>
          <select name="name" value={name} onChange={handleChange} className="w-full p-3 border rounded-lg" disabled={!category}>
            <option value="">Select Product</option>
            {[...new Set(products
              .filter((p) => p.category === category)
              .map((p) => p.name))]
              .map((productName, index) => (
                <option key={index} value={productName}>{productName.charAt(0).toUpperCase() + productName.slice(1)}</option>
              ))}
          </select>
        </div>

        <div>
          <label className="text-gray-700 font-medium">Unit</label>
          <select name="unit" value={unit} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="">Select Unit</option>
            {units.map((u, index) => (
              <option key={index} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
            ))}
          </select>
        </div>

        
          <div>
            <label className="text-gray-700 font-medium">Old Stock</label>
            <input type="number" value={oldStock} readOnly className="w-full p-3 border rounded-lg bg-gray-100" />
          </div>
        

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700 font-medium">New Stock</label>
            <input type="number" name="newStock" value={newStock} onChange={handleChange} placeholder="New Stock" className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="text-gray-700 font-medium">Today Consumption</label>
            <input type="number" name="consumed" value={consumed} onChange={handleChange} placeholder="Consumption" className="w-full p-3 border rounded-lg" />
          </div>
        </div>

        <div>
          <label className="text-gray-700 font-medium">In-Hand Stock</label>
          <input type="number" value={inHandStock} readOnly className="w-full p-3 border rounded-lg bg-gray-100" />
        </div>

        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg">Update Stock</button>
      </form>
    </div>
  );
};

export default DailyConsumption;

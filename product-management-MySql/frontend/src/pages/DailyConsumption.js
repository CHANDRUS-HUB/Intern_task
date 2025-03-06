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

  // Load product list
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        if (Array.isArray(data)) {
          setProducts(data);
          const uniqueCategories = [...new Set(data.map(product => product.category))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching product list:", error);
        toast.error("❌ Error fetching product list.");
      }
    };
    loadProducts();
  }, []);

  // Fetch product details based on name, category, and unit
  const fetchProductDetails = useCallback(
    debounce(async (productName, productCategory, productUnit) => {
      if (productName && productCategory && productUnit) {
        try {
          const data = await getProductByName(productName, productCategory, productUnit);
          if (data) {
            setOldStock(data.in_hand_stock || 0);
            setUnit(data.unit || "");
            setInHandStock(data.in_hand_stock || 0); // Auto-update in-hand stock initially
          } else {
            setOldStock(0);
            setUnit("");
            setInHandStock(0);
          }
        } catch {
          toast.error("❌ Error fetching product details.");
        }
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (name && category && unit) {
      fetchProductDetails(name, category, unit);
    }
  }, [name, category, unit, fetchProductDetails]);

  // Calculate in-hand stock
  useEffect(() => {
    const purchase = Number(newStock) || 0;
    const consumedQty = Number(consumed) || 0;
    setInHandStock(oldStock + purchase - consumedQty);
  }, [newStock, consumed, oldStock]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setName(value);
      setNewStock("");
      setConsumed("");
      setInHandStock(0);
    }
    if (name === "category") {
      setCategory(value);
      setNewStock("");
      setConsumed("");
      setInHandStock(0);
      const selectedUnits = products.filter(product => product.category === value).map(product => product.unit);
      setUnits([...new Set(selectedUnits)]);
    }
    if (name === "unit") {
      setUnit(value);
      setNewStock("");
      setConsumed("");
      setInHandStock(0);
    }

    if (name === "newStock" || name === "consumed") {
      if (!/^\d*\.?\d*$/.test(value)) {
        toast.error("❌ Please enter a valid number.");
        return;
      }
      if (Number(value) < 0) {
        toast.error("❌ Value cannot be negative.");
        return;
      }
      if (name === "newStock") setNewStock(value);
      if (name === "consumed") setConsumed(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !unit) return toast.error("❌ Please select a valid product, category, and unit.");
    if (!newStock.trim() && !consumed.trim()) return toast.error("❌ Please enter either new stock or consumed quantity.");

    const updateData = { newStock, consumed };
    try {
      await updateProduct(name, category, unit, updateData);
      toast.success("✅ Stock updated successfully!");
      setName("");
      setCategory("");
      setUnit("");
      setNewStock("");
      setConsumed("");
      setInHandStock(0);
    } catch (error) {
      toast.error(`❌ Error updating stock: ${error.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Daily Consumption</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-gray-700 font-medium">Select a Product</label>
          <select name="name" value={name} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="">Select Product</option>
            {products.map((p, index) => (
              <option key={index} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-700 font-medium">Category</label>
          <select name="category" value={category} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="">Select Category</option>
            {categories.map((c, index) => (
              <option key={index} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-700 font-medium">Unit</label>
          <select name="unit" value={unit} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="">Select Unit</option>
            {units.map((u, index) => (
              <option key={index} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-700 font-medium">Old Stock</label>
          <input type="number" value={oldStock} readOnly className="w-full p-3 border rounded-lg bg-gray-100" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="newStock" value={newStock} onChange={handleChange} placeholder="New Stock" className="w-full p-3 border rounded-lg" />
          <input type="number" name="consumed" value={consumed} onChange={handleChange} placeholder="Consumption" className="w-full p-3 border rounded-lg" />
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

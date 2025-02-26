import { useState } from "react";
import axios from "axios";
import { baseurl } from "../URL/url";

function AddProduct() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [product, setProduct] = useState({
    name: "",
    date: "",
    old_stock: 0,
    quantity: 0,
    consumed: 0,
    in_hand_stock: 0,
  });

  const categoryOptions = ["Dairy Products", "Canteen", "Stationary", "Washroom", "Office Products", "Fruits", "Snacks"];

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setProduct((prev) => {
      const updatedProduct = {
        ...prev,
        [name]: value,
      };
      if (name === "quantity" || name === "consumed") {
        updatedProduct.in_hand_stock = prev.old_stock + Number(updatedProduct.quantity) - Number(updatedProduct.consumed);
      }
      return updatedProduct;
    });

    if (name === "name") {
      try {
        const res = await axios.get(`${baseurl}/product/${value}`);
        if (res.data) {
          setProduct((prev) => ({
            ...prev,
            old_stock: res.data.in_hand_stock || 0,
          }));
        }
      } catch (error) {
        console.warn("New product, setting stock to 0.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.date) {
      setProduct((prev) => ({
        ...prev,
        date: new Date().toISOString().split("T")[0],
      }));
    }

    if (!selectedCategory || !unit) {
      alert("⚠️ Please select category and unit!");
      return;
    }

    try {
      await axios.post(`${baseurl}/add-product`, { ...product, category: selectedCategory, unit });
      alert("✅ Product added successfully!");
      setProduct({ name: "", date: "", old_stock: 0, quantity: 0, consumed: 0, in_hand_stock: 0 });
      setSelectedCategory("");
      setUnit("");
    } catch (error) {
      console.error("❌ Error adding product:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <label className="w-1/3">Product Name:</label>
          <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} className="w-2/3 p-2 border rounded" required />
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-2/3 p-2 border rounded" required>
            <option value="">Select Category</option>
            {categoryOptions.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Quantity:</label>
          <input type="number" name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} className="w-2/3 p-2 border rounded" required />
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Unit:</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-2/3 p-2 border rounded" required>
            <option value="">Select Quantity Type</option>
            <option value="kg">Kilograms</option>
            <option value="liter">Liter</option>
            <option value="package">Packget</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Date:</label>
          <input type="date" name="date" value={product.date} onChange={handleChange} className="w-2/3 p-2 border rounded" required />
        </div>

        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;

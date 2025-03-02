
import { useState } from "react";
import { toast } from "react-toastify";
import { addProduct } from "../api/productApi"; 

const unitTypes = ["kg", "g", "liter", "ml", "package", "piece", "box", "dozen", "bottle", "can"];

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    quantity: "",
    unit: "",
    consumed: "",
  });

  const [loading, setLoading] = useState(false); 

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        toast.error("❌ Product name should only contain letters and spaces.");
        return;
      }
    }

    if (name === "quantity" || name === "consumed") {
      if (!/^\d*\.?\d*$/.test(value)) {
        toast.error("❌ Please enter a valid number.");
        return;
      }
    }

    setProduct({ ...product, [name]: value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name.trim()) {
      toast.error(" Product name is required.");
      return;
    }

    if (!unitTypes.includes(product.unit)) {
      toast.error(" Invalid unit. Choose from: " + unitTypes.join(", "));
      return;
    }

    setLoading(true); 

    try {
      await addProduct({
        name: product.name.trim(),
        quantity: product.quantity, 
        unit: product.unit,
        consumed: product.consumed,
      });

      toast.success(" Product added successfully!");
      setProduct({ name: "", quantity: "", unit: "", consumed: "" });
    } catch (error) {
      console.error(" API Error:", error.response?.data || error.message);
      toast.error(" Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="unit"
          value={product.unit}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Unit</option>
          {unitTypes.map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>

        <input
          type="number"
          name="consumed"
          placeholder="Consumed Quantity"
          value={product.consumed}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

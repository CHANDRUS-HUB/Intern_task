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
        toast.error(" Product name should only contain letters and spaces.");
        return;
      }
    }

    if (name === "quantity" || name === "consumed") {
      if (!/^\d*\.?\d*$/.test(value)) {
        toast.error(" Please enter a valid number.");
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
      toast.error("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="text-gray-700 font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={product.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            placeholder="Enter quantity"
            value={product.quantity}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Unit</label>
          <select
            name="unit"
            value={product.unit}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="">Select Unit</option>
            {unitTypes.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-700 font-medium">Consumed Quantity</label>
          <input
            type="number"
            name="consumed"
            placeholder="Enter consumed amount"
            value={product.consumed}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full font-semibold py-3 rounded-lg shadow-md transition-all ${
            loading
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

import { useState, useEffect } from "react";
import { addProduct } from "../api/productApi";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Backend URL

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
  });

  // Fetch category from backend when product name changes
  useEffect(() => {
    const fetchCategory = async () => {
      if (product.name.trim() !== "") {
        try {
          const response = await axios.get(`${API_BASE_URL}/get-category/${product.name}`);
          setProduct((prev) => ({
            ...prev,
            category: response.data.category || "",
          }));
        } catch (error) {
          console.error("Error fetching category:", error);
          setProduct((prev) => ({ ...prev, category: "" }));
        }
      }
    };

    fetchCategory();
  }, [product.name]);

  // Handle input changes
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.category) {
      toast.error("❌ Please enter a valid product name.");
      return;
    }

    try {
      await addProduct(product);
      
      // ✅ Show success toast
      toast.success("✅ Product added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // ✅ Reset form after success
      setProduct({ name: "", category: "", quantity: "", unit: "" });
    } catch (error) {
      toast.error("⚠️ Error adding product.");
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

        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
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
          <option value="">Select Quantity</option>
          <option value="kg">Kg</option>
          <option value="liter">Liter</option>
          <option value="package">Package</option>
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

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

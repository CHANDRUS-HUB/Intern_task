import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addProduct } from "../api/productApi";
import axios from "axios";
const categoryUnits = {
  canteen: ["kg", "liter", "packet"],
  stationary: ["piece", "box"],
  washroom: ["roll", "piece"],
};

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    consumed: "",
  });

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch categories from backend
    axios.get("http://localhost:5000/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => toast.error("Error fetching categories"));
  }, []);

  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setProduct({
      ...product,
      category: selectedCategory,
      name: "", // Reset product name
      unit: "", // Reset unit on category change
    });

    if (selectedCategory) {
      try {
        const response = await axios.get(`http://localhost:5000/products/${selectedCategory}`);
        setProducts(response.data); // Fetch products for the selected category
      } catch (error) {
        toast.error("Error fetching products");
      }
    } else {
      setProducts([]); // Clear products if no category is selected
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Product name validation (Allow alphanumeric characters and spaces)
    if (name === "name" && !/^[A-Za-z0-9 ]*$/.test(value)) {
      toast.error("Product name can only contain letters, numbers, and spaces.");
      return;
    }

    // Quantity and consumed validation (Allow only valid numbers)
    if ((name === "quantity" || name === "consumed") && !/^\d*\.?\d*$/.test(value)) {
      toast.error("Please enter a valid number.");
      return;
    }

    setProduct({ ...product, [name]: value });
  };

  const handleProductSelection = (e) => {
    setProduct({ ...product, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!product.unit) {
      toast.error("Please select a unit.");
      return;
    }

    if (!product.quantity || parseFloat(product.quantity) <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    if (!product.consumed || parseFloat(product.consumed) <= 0) {
      toast.error("Please enter a valid consumed quantity.");
      return;
    }

    setLoading(true);

    try {
      await addProduct({
        name: product.name.trim(),
        category: product.category,
        quantity: product.quantity,
        unit: product.unit,
        consumed: product.consumed,
      });

      toast.success("Product added successfully!");
      setProduct({ name: "", category: "", quantity: "", unit: "", consumed: "" });
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
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
          <label className="text-gray-700 font-medium">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleCategoryChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {product.category && (
          <div>
            <label className="text-gray-700 font-medium">Product Name</label>
            <select
              value={product.name}
              onChange={handleProductSelection}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select a Product</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.name}>{prod.name}</option>
              ))}
            </select>
          </div>
        )}


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

        {/* Unit Selection */}
        <select
          name="unit"
          value={product.unit}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        >
          <option value="">Select Unit</option>
          {(categoryUnits[product.category] || []).map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>

        {/* Consumed Quantity */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full font-semibold py-3 rounded-lg shadow-md transition-all ${loading
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

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { addProduct } from "../api/productApi";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "", // will hold category id (string)
    new_stock: "",
    unit: "",
    consumed: "",
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/categories")
      .then((response) => {
        console.log("Fetched categories:", response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.error("Error fetching categories");
      });
  }, []);

  // When a category is selected, fetch allowed units and (optionally) keywords or products for that category
  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value; // now a category id
    setProduct({
      ...product,
      category: selectedCategoryId,
      name: "",
      new_stock: "",
      unit: "",
      consumed: "",
    });
    setProducts([]);
    setUnits([]);
    setKeywords([]);

    if (!selectedCategoryId) return;

    try {
      // Fetch keywords for product names (if needed)
      const keywordRes = await axios.get(`http://localhost:5000/keywords/${selectedCategoryId}`);
      console.log("Keywords response:", keywordRes.data);
      setKeywords(keywordRes.data.keywords || []);

      // Fetch allowed units from the backend
      const unitRes = await axios.get(`http://localhost:5000/units/${selectedCategoryId}`);
      console.log("Units response:", unitRes.data);
      setUnits(unitRes.data.units || []);

      // (Optionally) fetch existing products for this category if you need to show them
      const productRes = await axios.get(`http://localhost:5000/products/${selectedCategoryId}`);
      console.log("Products response:", productRes.data);
      setProducts(productRes.data || []);
    } catch (error) {
      console.error("Error fetching category details:", error);
      toast.error("Error fetching products, keywords, or units.");
    }
  };

  // Update state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && !/^[A-Za-z0-9 ]*$/.test(value)) {
      toast.error("Product name can only contain letters, numbers, and spaces.");
      return;
    }
    if ((name === "new_stock" || name === "consumed") && !/^\d*\.?\d*$/.test(value)) {
      toast.error("Please enter a valid number.");
      return;
    }
    setProduct({ ...product, [name]: value });
  };

  // For product name selection from the dropdown (using keywords)
  const handleProductSelection = (e) => {
    setProduct({ ...product, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name.trim()) {
      toast.error("Please select a product.");
      return;
    }
    if (!product.unit) {
      toast.error("Please select a unit.");
      return;
    }
    if (!product.new_stock || parseFloat(product.new_stock) <= 0) {
      toast.error("Enter a valid stock quantity.");
      return;
    }
    if (!product.consumed || parseFloat(product.consumed) < 0) {
      toast.error("Enter a valid consumed quantity.");
      return;
    }

    const productData = {
      name: product.name,
      category: product.category, // Pass the category id; backend can further determine details if needed
      new_stock: parseFloat(product.new_stock),
      unit: product.unit,
      consumed: parseFloat(product.consumed),
    };

    setLoading(true);
    try {
      const result = await addProduct(productData);
      console.log("Add Product API result:", result);
      toast.success("Product added successfully!");
      // Reset form state
      setProduct({
        name: "",
        category: "",
        new_stock: "",
        unit: "",
        consumed: "",
      });
      setProducts([]);
      setUnits([]);
      setKeywords([]);
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Name Selection */}
        {product.category && (
          <div>
            <label className="text-gray-700 font-medium">Product Name</label>
            {keywords.length > 0 ? (
              <select
                name="name"
                value={product.name}
                onChange={handleProductSelection}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="">Select a Product</option>
                {keywords.map((kw, i) => (
                  <option key={i} value={kw}>
                    {kw}
                  </option>
                ))}
              </select>
            ) : products.length > 0 ? (
              <select
                name="name"
                value={product.name}
                onChange={handleProductSelection}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="">Select a Product</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.name}>
                    {prod.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-500">No product keywords or existing products available for this category.</p>
            )}
          </div>
        )}

        {/* Stock Quantity */}
        {product.category && (
          <div>
            <label className="text-gray-700 font-medium">Stock Quantity</label>
            <input
              type="number"
              name="new_stock"
              placeholder="Enter stock quantity"
              value={product.new_stock}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
        )}

        {/* Unit Selection */}
        {product.category && (
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
              {units.map((u, idx) => (
                <option key={idx} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Consumed Quantity */}
        {product.category && (
          <div>
            <label className="text-gray-700 font-medium">Consumed Quantity</label>
            <input
              type="number"
              name="consumed"
              placeholder="Enter consumed quantity"
              value={product.consumed}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full font-semibold py-3 rounded-lg shadow-md transition-all ${
            loading ? "bg-gray-400 text-gray-800 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-blue-700"
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

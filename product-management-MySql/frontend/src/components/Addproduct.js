import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { addProduct } from "../api/productApi";
import { baseurl } from "../URL/url";
const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    new_stock: "",
    unit: "",
    consumed: "",
  });
  const [categories, setCategories] = useState([]);
  const [, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    axios
      .get(`${baseurl}/categories`)
      .then((response) => {
        console.log("Fetched categories:", response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.error("Error fetching categories");
      });
  }, []);


  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
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

      const keywordRes = await axios.get(`${baseurl}/keywords/${selectedCategoryId}`);
      console.log("Keywords response:", keywordRes.data);
      setKeywords(keywordRes.data.keywords || []);


      const unitRes = await axios.get(`${baseurl}/units/${selectedCategoryId}`);
      console.log("Units response:", unitRes.data);
      setUnits(unitRes.data.units || []);


      const productRes = await axios.get(`${baseurl}/products/${selectedCategoryId}`);
      console.log("Products response:", productRes.data);
      setProducts(productRes.data || []);
    } catch (error) {
      console.error("Error fetching category details:", error);
      toast.error("Error fetching products, keywords, or units.");
    }
  };


  const handleChange = (e) => {
    let { name, value } = e.target;
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    if (name === "name" && !/^[A-Za-z0-9 ]*$/.test(value)) {

      toast.error("Product name can only contain letters, numbers, and spaces.");
      return;
    }
    if ((name === "new_stock" || name === "consumed") && !/^\d*\.?\d*$/.test(value)) {
      toast.error("Please enter a valid number.");
      return;
    }
    setProduct((prev) => ({ ...prev, [name]: value }));
  };


  const handleProductSelection = (e) => {
    setProduct({ ...product, name: e.target.value });
    
  };

  const handleUnitSelection = (e) => {
    setProduct({ ...product, unit: e.target.value });
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
      category: product.category,
      new_stock: parseFloat(product.new_stock),
      unit: product.unit,
      consumed: parseFloat(product.consumed),
    };

    setLoading(true);
    try {
      const result = await addProduct(productData);
      console.log("Add Product API result:", result);
      toast.success("Product added successfully!");

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
                <option value="">Select Product</option>
                {keywords.map((kw, i) => (
                  <option key={i} value={kw}>
                    {kw}
                  </option>
                ))}
              </select>
                ) : (
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={product.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                  />
                )}
              </div>
            )}


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


        {product.category && (
          <div>
            <label className="text-gray-700 font-medium">Unit</label>
            <select
              name="unit"
              value={product.unit || ""}
              onChange={handleUnitSelection}
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


        <button
          type="submit"
          className={`w-full font-semibold py-3 rounded-lg shadow-md transition-all ${loading ? "bg-gray-400 text-gray-800 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-blue-700"
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

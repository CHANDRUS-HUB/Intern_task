import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseurl } from "../URL/url";

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]); // ✅ Track all products
  const [product, setProduct] = useState({
    name: "",
    category: "",
    date: "",
    old_stock: "",
    quantity: "",
    consumed: "",
    in_hand_stock: "",
  });

  // ✅ Ensure useEffect runs only once
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchCategories();
      fetchProducts();
    }
  }, []);

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseurl}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ✅ Fetch Products & Remove Duplicates
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseurl}/products`);
      console.log("Fetched Products:", res.data);

      // Remove duplicates before setting state
      const uniqueProducts = res.data.filter(
        (value, index, self) => index === self.findIndex((p) => p.id === value.id)
      );

      setProducts(uniqueProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ✅ Handle Input Change
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setProduct((prev) => {
      const updatedProduct = { ...prev, [name]: value };

      if (name === "name" && value.trim() !== "") {
        axios.get(`${baseurl}/product/${value}`)
          .then((res) => {
            const existingProduct = res.data;
            setProduct((prev) => ({
              ...prev,
              old_stock: existingProduct ? Number(existingProduct.in_hand_stock) : 0,
            }));
          })
          .catch((err) => console.error(err));
      }

      // ✅ Auto-calculate In-Hand Stock
      if (name === "quantity" || name === "consumed") {
        updatedProduct.in_hand_stock =
          (Number(updatedProduct.old_stock) || 0) +
          (Number(updatedProduct.quantity) || 0) -
          (Number(updatedProduct.consumed) || 0);
      }

      return updatedProduct;
    });
  };

  // ✅ Handle Category Selection
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setProduct((prev) => ({ ...prev, category: e.target.value }));
  };

  // ✅ Prevent Duplicate Product Addition
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the product already exists
    const existingProduct = products.find((p) => p.name.toLowerCase() === product.name.toLowerCase());
    if (existingProduct) {
      alert("This product already exists!");
      return;
    }

    const formattedProduct = {
      ...product,
      old_stock: Number(product.old_stock) || 0,
      quantity: Number(product.quantity) || 0,
      consumed: Number(product.consumed) || 0,
      in_hand_stock: Number(product.in_hand_stock) || 0,
    };

    try {
      const response = await axios.post(`${baseurl}/add-product`, formattedProduct);

      if (response.data.updated) {
        alert("Stock updated for existing product!");
      } else {
        alert("Product added successfully!");
      }

      // ✅ Refresh product list
      fetchProducts();

      // ✅ Reset form
      setSelectedCategory("");
      setProduct({
        name: "",
        category: "",
        date: "",
        old_stock: "",
        quantity: "",
        consumed: "",
        in_hand_stock: "",
      });

    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add/update product.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
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
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input type="date" name="date" value={product.date} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="old_stock" placeholder="Old Stock" value={product.old_stock} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="number" name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="number" name="consumed" placeholder="Consumed" value={product.consumed} onChange={handleChange} className="w-full p-2 border rounded" />

        {/* ✅ Auto-calculated In-Hand Stock */}
        <input type="number" name="in_hand_stock" placeholder="In-Hand Stock" value={product.in_hand_stock} className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed" disabled />

        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;

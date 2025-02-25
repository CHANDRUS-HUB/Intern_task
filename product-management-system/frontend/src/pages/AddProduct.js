import { useState, useEffect } from "react";
import axios from "axios";

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // ✅ Fix: Define setSelectedCategory
  const [product, setProduct] = useState({
    name: "",
    category: "",
    date: "",
    old_stock: "",
    quantity: "",
    consumed: "",
    in_hand_stock: "",
  });

  useEffect(() => {
    const fetchCategories = () => {
      axios.get("http://localhost:5000/categories")
        .then((res) => setCategories(res.data))
        .catch((err) => console.error(err));
    };

    fetchCategories();
    window.addEventListener("categoriesUpdated", fetchCategories);

    return () => {
      window.removeEventListener("categoriesUpdated", fetchCategories);
    };
  }, []);
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setProduct((prev) => {
        const updatedProduct = { ...prev, [name]: value };

        if (name === "name" && value.trim() !== "") {
            // Check if the product exists in DB
            axios.get(`http://localhost:5000/product/${value}`)
                .then((res) => {
                    if (res.data) {
                        setProduct((prev) => ({
                            ...prev,
                            old_stock: res.data.in_hand_stock, // Auto-fill old stock
                        }));
                    } else {
                        setProduct((prev) => ({
                            ...prev,
                            old_stock: 0, // If product doesn't exist, set old stock to 0
                        }));
                    }
                })
                .catch((err) => console.error(err));
        }

        // ✅ Auto-calculate In-Hand Stock
        if (name === "quantity" || name === "consumed") {
            updatedProduct.in_hand_stock = (Number(updatedProduct.quantity) || 0) - (Number(updatedProduct.consumed) || 0);
        }

        return updatedProduct;
    });
};


  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setProduct((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedProduct = {
      ...product,
      old_stock: Number(product.old_stock) || 0,
      quantity: Number(product.quantity) || 0,
      consumed: Number(product.consumed) || 0,
      in_hand_stock: Number(product.in_hand_stock) || 0,
    };

    try {
      const response = await axios.post("http://localhost:5000/add-product", formattedProduct);

      if (response.data.updated) {
        alert("Stock updated for existing product!");
      } else {
        alert("Product added successfully!");
      }

      // ✅ Fix: Reset selectedCategory after submit
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

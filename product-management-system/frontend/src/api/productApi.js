import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // ✅ Ensure backend is running

// ✅ Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data; // ✅ Fix: No need for `response.json()`
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};

// ✅ Fetch a product by name & category
export const getProductByName = async (name, category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products?name=${name}&category=${category}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return null;
  }
};

// ✅ Add a new product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-product`, productData);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding product:", error.response?.data || error);
    throw error;
  }
};


// ✅ Update product stock
export const updateProduct = async (name, stockData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-product/${name}`, stockData);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating stock:", error.response?.data || error.message);
    throw error;
  }
};


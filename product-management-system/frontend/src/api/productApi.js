import axios from "axios";
const API_BASE_URL = "http://localhost:5000"; // Make sure this URL is correct!

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    console.log("🔹 API Response:", response.data); // ✅ Debugging Log
    return response.data; // Ensure correct return value
  } catch (error) {
    console.error("❌ Error fetching products:", error.response?.data || error.message);
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

export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-product`, productData);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (name, category, { newStock, consumed }) => {
  console.log("📡 Sending update request:", { name, category, newStock, consumed });

  try {
    const response = await axios.put(`${API_BASE_URL}/update-product`, {
      name,
      category,
      new_purchase: Number(newStock) || 0, // Convert to number
      consumed: Number(consumed) || 0,
    });

    console.log("✅ Update success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Update Failed:", error.response?.data || error.message);
    throw error;
  }
};

export const getProductByNameAndCategory = async (name, category) => {
  try {
    const response = await axios.get('/api/products', {
      params: { name, category }
    });
    return response.data; // Return the product data
  } catch (error) {
    throw new Error('Error fetching product details');
  }
};



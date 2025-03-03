import axios from "axios";
const API_BASE_URL = "http://localhost:4000"; 


export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    console.log(" API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Fetch Error:", error.response?.data || error.message);
    return [];
  }
};


export const fetchLatestStock = async (productName, category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/${productName.toLowerCase()}/${category.toLowerCase()}`);
    console.log("Latest Stock Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching latest stock:", error.response?.data || error.message);
    return null; 
  }
};


export const getProductByName = async (name) => {
  try {
    const cleanedName = name.trim().toLowerCase(); 

    console.log("📡 Fetching Product:", `"${cleanedName}"`);

    const response = await axios.get(`${API_BASE_URL}/products/${cleanedName}`);
    return response.data;
  } catch (error) {
    console.error(" Error fetching product:", error.response?.data || error.message);
    throw error;
  }
};


export const addProduct = async (productData) => {
  try {
    console.log(" Sending Product Data:", productData);

    const response = await axios.post(`${API_BASE_URL}/add-product`, {
      name: productData.name.trim(), 
      new_stock: Number(productData.quantity), 
      unit: productData.unit, 
      consumed: Number(productData.consumed), 
    });

    console.log(" Product added:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Error adding product:", error.response?.data || error.message);
    throw error; 
  }
};

export const checkProductExists = async (name, category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/${name.toLowerCase()}/${category.toLowerCase()}`);
    return response.data; 
  } catch (error) {
    console.error("Product not found:", error.response?.data || error.message);
    return null; 
  }
};


export const updateProduct = async (name, { newStock, unit, consumed }) => {
  try {
    console.log(" Sending update request:", { name, newStock, unit, consumed });

    if (!unit) {
      throw new Error(" Unit is required!");
    }

    const response = await axios.put(`${API_BASE_URL}/products/update${name.toLowerCase()}`, {
      new_stock: Number(newStock) || 0, 
      unit,
      consumed: Number(consumed) || 0, 
    });

    console.log(" Update success:", response.data);
    return response.data;
  } catch (error) {
    console.error(" API Update Failed:", error.response?.data || error.message);
    throw error;
  }
};

import axios from "axios";
const API_BASE_URL = "http://localhost:5000"; // Make sure this URL is correct!

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    console.log(" API Response:", response.data); //  Debugging Log
    return response.data; // Ensure correct return value
  } catch (error) {
    console.error(" Error fetching products:", error.response?.data || error.message);
    return [];
  }
};



export const fetchLatestStock = async (productName, category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/latest-stock/${productName}/${category}`);
    console.log("Latest Stock Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Error fetching latest stock:", error.response?.data || error.message);
    return null;
  }
};


// ✅ Fetch a product by name & category
export const getProductByName = async (name, category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/${name}/${category}`);
    return response.data;
  } catch (error) {
    console.error(" Error fetching product:", error);
    return null;
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-product`, productData);
    return response.data;
  } catch (error) {
    console.error(" Error adding product:", error);
    throw error;
  }
};

export const checkProductExists = async (name, category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/${name}/${category}`);
    return response.data; // Product exists
  } catch (error) {
    console.error(" Product not found:", error.response?.data || error.message);
    return null; // Product does NOT exist
  }
};  


export const updateProduct = async (name, category, { newStock,unit, consumed }) => {
  console.log("📡 Checking if product exists:", { name, category });
  const productExists = await checkProductExists(name, category);

  if (!productExists) {
    console.error(" Error: Product does not exist in the database. Cannot update.");
    return { error: "⚠️ Product does not exist. Please add it first!" };
  }
  console.log("📡 Sending update request:", { name, category, newStock, unit,consumed });
  if (!unit) {
    console.error(" Error: `unit` is missing!");
    return;
  }
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${name.tolowercase()}/${category.tolowercase()}`, {
      name,
      category,
      unit,
      new_purchase: Number(newStock) || 0, 
      consumed: Number(consumed) || 0,
    });

    console.log(" Update success:", response.data);
    return response.data;
  } catch (error) {
    console.error(" API Update Failed:", error.response?.data || error.message);
    throw error;
  }
};





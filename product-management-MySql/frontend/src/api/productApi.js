// api/productApi.js

import axios from "axios";
export const getProducts= async (productData) => {
  try {
    const response = await axios.get("http://localhost:5000/products", productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



export const addProduct = async (productData) => {
  try {
    const response = await axios.post("http://localhost:5000/add-product", productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



export const updateProduct = async (name, category, unit, updateData) => {
  try {
    const response = await fetch(
      `http://localhost:5000/update/${encodeURIComponent(name)}/${encodeURIComponent(category)}/${encodeURIComponent(unit)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      }
    );

    let data;
    try {
      data = await response.json(); // Attempt to parse JSON response
    } catch {
      throw new Error(`Failed to parse server response.`);
    }

    if (!response.ok) {
      throw new Error(data.error || `Failed to update product: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error("Update error:", error.message);
    throw error;
  }
};





export const getProductByName = async (name) => {
  try {
    const response = await fetch(`http://localhost:5000/product/${encodeURIComponent(name)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data = await response.json(); // Correct way to parse JSON response
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null; // Handle errors gracefully
  }
};


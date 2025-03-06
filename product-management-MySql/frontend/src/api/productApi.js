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
      `/update-product?name=${name}&category=${category}&unit=${unit}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    return data;
  } catch (error) {
    console.error("Error updating product:", error.message);
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


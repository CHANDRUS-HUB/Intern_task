
import axios from "axios";
import { baseurl } from "../URL/url";


export const getProducts = async (productData) => {
  try {
    const response = await axios.get(`${baseurl}/products`, {
      params: productData,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${baseurl}/delete/${productId}`,{ withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};


export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${baseurl}/add-product`, productData,{ withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateProduct = async (name, category, unit, updateData) => {
  try {
    const response = await axios.put(`${baseurl}/update-product/${name}/${category}/${unit}`, updateData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error.message);
    throw error.response?.data || error.message;
  }
};


export const getProductByName = async (name) => {
  try {
    const response = await fetch(`${baseurl}/product/${encodeURIComponent(name)}`,{ withCredentials: true });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data = await response.json(); 
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null; 
  }
};


export const checkAuth = async () => {
  try {
      const response = await fetch(`${baseurl}/auth-check`,{ withCredentials: true }, {
          method: 'GET',
          credentials: 'include' 
      });

      const data = await response.json();
      return data.isAuthenticated;
  } catch (error) {
      console.error("Auth check failed:", error);
      return false;
  }
};




import axios from "axios";
import { baseurl } from "../URL/url";
import { toast } from "react-toastify";

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${baseurl}/products`);
    console.log(" API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Fetch Error:", error.response?.data || error.message);
    return [];
  }
};


export const fetchLatestStock = async (productName, category) => {
  try {
    const response = await axios.get(`${baseurl}/product/${productName.toLowerCase()}/${category.toLowerCase()}`);
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

    const response = await axios.get(`${baseurl}/product/${cleanedName}`);
    return response.data;
  } catch (error) {
    console.error(" Error fetching product:", error.response?.data || error.message);
    throw error;
  }
};


export const addProduct = async (productData) => {
  try {
    console.log(" Sending Product Data:", productData);

    const response = await axios.post(`${baseurl}/add-product`, {
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
    const response = await axios.get(`${baseurl}/product/${name.toLowerCase()}/${category.toLowerCase()}`);
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

    const response = await axios.put(`${baseurl}/products/update/${name.toLowerCase()}`, {
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







export const downloadPDF = async () => {
    try {
        const response = await axios.get(`${baseurl}/export-pdf`, {
            responseType: 'blob' // Important for handling PDF files
        });

        // Create a Blob URL for the PDF file
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Create a download link
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Product_List.pdf';
        document.body.appendChild(link);

        // Trigger download and cleanup
        link.click();
        link.remove();

        // Free up memory
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        toast.error('Failed to download PDF. Please try again.');
    }
};


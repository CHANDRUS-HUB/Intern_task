// api/productApi.js
export const fetchProducts = async () => {
  const response = await fetch("/products");
  return response.json();
};

export const addProduct = async (productData) => {
  const response = await fetch("/add-product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const updateProduct = async (name, updateData) => {
  const response = await fetch(`/products/update/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  return response.json();
};

export const getProductByName = async (name) => {
  const response = await fetch(`/product/${name}`);
  return response.json();
};

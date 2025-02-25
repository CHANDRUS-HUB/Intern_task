import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseurl } from "../URL/url";

function Products() {
  const [products, setProducts] = useState([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchProducts();
    }
  }, []);


  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseurl}/products`);
      console.log("Fetched Products:", res.data);

    
      const uniqueProducts = res.data.filter(
        (value, index, self) => index === self.findIndex((p) => p.id === value.id)
      );

      setProducts(uniqueProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Product Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Old Stock</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Consumed</th>
            <th className="border p-2">In-Hand Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" className="border p-4 text-center text-gray-500">
                No products available.
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product.id || index} className="border">
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">
                  {product.category_name || "Uncategorized"}
                </td>
                <td className="border p-2">{product.date}</td>
                <td className="border p-2">{product.old_stock}</td>
                <td className="border p-2">{product.quantity}</td>
                <td className="border p-2">{product.consumed}</td>
                <td className="border p-2">{product.in_hand_stock}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Products;

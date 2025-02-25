import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
<div className="p-6">
      <h2 className="text-xl font-bold mb-4">Product List</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Old Stock</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Consumed</th>
            <th className="border p-2">In-Hand Stock</th>
            <th className="border p-2">Date</th> {/* ✅ Added Date Column */}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">{product.old_stock}</td>
              <td className="border p-2">{product.quantity}</td>
              <td className="border p-2">{product.consumed}</td>
              <td className="border p-2">{product.in_hand_stock}</td>
              <td className="border p-2">{product.date}</td> {/* ✅ Show Date */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Products;

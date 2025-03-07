import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewDetails = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setUniqueProductNames] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();
  const itemsPerPage = 5;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
        setFilteredProducts(Array.isArray(data) ? data : []);

        const uniqueNames = [...new Set(data.map((product) => product.name))];
        setUniqueProductNames(uniqueNames);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please check the backend.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  const productNames = [...new Set(products.map((p) => p.name.toLowerCase()))];
  const handleSearch = (e) => {
    const value = e.target.value;

    if (/\d/.test(value)) {
      toast.error("Product name should not contain numbers.");
      return;
    }

    setSearchTerm(value);
  };

  useEffect(() => {
    let updatedProducts = [...products];

    if (searchTerm.trim() !== "") {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      updatedProducts.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "createdAt") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredProducts(updatedProducts);
    setCurrentPage(1);
  }, [searchTerm, products, sortConfig]);

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Product Details</h2>

        <button
          onClick={() => navigate("/daily-consumption")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Update Stock
        </button>
      </div>

      <div className="mb-4 flex items-center gap-4">
      <input
        type="text"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
      />

      <select
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"

        value={productNames.includes(searchTerm.toLowerCase()) ? searchTerm.toLowerCase() : ""}
        onChange={(e) => setSearchTerm(e.target.value)}
      >
        <option value="">Select a Product</option>
        {productNames.map((productName, index) => (
          <option key={index} value={productName}>
            {productName.charAt(0).toUpperCase() + productName.slice(1)}
          </option>
        ))}
      </select>
    </div>

      {loading && <p className="text-center text-gray-500">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {filteredProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-purple-600 text-white text-left">
                <th className="p-3 cursor-pointer" onClick={() => toggleSort("name")}>
                  Product Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "" : "") : ""}
                </th>
                <th className="p-3">Category</th>
                <th className="p-3">Old Stock</th>
                <th className="p-3">New Stock</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Consumed</th>
                <th className="p-3">In-Hand Stock</th>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort("createdAt")}>
                  Date {sortConfig.key === "createdAt" ? (sortConfig.direction === "asc" ? "" : "") : ""}
                </th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className={`text-gray-700 text-center ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition`}
                >
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category || "N/A"}</td>
                  <td className="p-3">{product.old_stock ?? 0}</td>
                  <td className="p-3">{product.new_stock ?? 0}</td>
                  <td className="p-3">{product.unit || "N/A"}</td>
                  <td className="p-3">{product.consumed ?? 0}</td>
                  <td className="p-3">{product.in_hand_stock ?? 0}</td>
                  <td className="p-3">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate("/daily-consumption")}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-center text-gray-800">No products available.</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            disabled={currentPage === 1}
          >
            ◀ Prev
          </button>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewDetails;
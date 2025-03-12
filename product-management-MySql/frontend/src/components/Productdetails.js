import { useEffect, useState ,useRef} from "react";
import { getProducts, deleteProduct } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EditModal from "../components/EditModel";
import DeleteConfirmationModal from "../components/DeleteConfirm";
import jsPDF from 'jspdf';
import { FaFilePdf } from 'react-icons/fa';
import html2canvas from 'html2canvas';

const ViewDetails = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const dashboardRef = useRef(null);
useEffect(() => {

  
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
        setFilteredProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please check the backend.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    if (/\d/.test(value)) {
      toast.error("Product name should not contain numbers.");
      return;
    }
    setSearchTerm(value);
  };

  useEffect(() => {
    const updatedProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(updatedProducts);
  }, [searchTerm, products]);

  const handleDelete = async (productId) => {
    if (!productId) {
      toast.error("Product ID is missing. Unable to delete.");
      return;
    }
    console.log("Deleting product ID:", productId);
    try {
      await deleteProduct(productId);  // Call the axios API function
      // Update the products state by filtering out the deleted product
      setProducts(products.filter((p) => p._id !== productId));
      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(`Error deleting product: ${error.message}`);
    }
  };
  
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredProducts(sortedProducts);
    setSortConfig({ key, direction });
  };
    const exportToPDF = () => {
      const hiddenContent = document.createElement('div');
      hiddenContent.innerHTML = `
          <div id="hidden-content">
              <h2 style="text-align: center;padding-buttom:">Product Management Report</h2>
              <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                      <tr style="background-color: #6b46c1; color: #fff;">
                          <th style="padding: 8px; border: 1px solid #ddd;">Product Name</th>
                          <th style="padding: 8px; border: 1px solid #ddd;">Category</th>
                          <th style="padding: 8px; border: 1px solid #ddd;">Old Stock</th>
                          <th style="padding: 8px; border: 1px solid #ddd;">New Stock</th>
                          <th style="padding: 8px; border: 1px solid #ddd;">Unit</th>
                          <th style="padding: 8px; border: 1px solid #ddd;">Consumed</th>
                          <th style="padding: 8px; border: 1px solid #ddd;">In-Hand Stock</th>
                          <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${products.map(product => `
                          <tr>
                              <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
                              <td style="padding: 8px; border: 1px solid #ddd;">${product.category || "N/A"}</td>
                              <td style="padding: 8px; border: 1px solid #ddd;">${product.old_stock ?? 0}</td>
                              <td style="padding: 8px; border: 1px solid #ddd;">${product.new_stock ?? 0}</td>
                              <td style="padding: 8px; border: 1px solid #ddd;">${product.unit || "N/A"}</td>
                              <td style="padding: 8px; border: 1px solid #ddd;">${product.consumed ?? 0}</td>
                              <td style="padding: 8px; border: 1px solid #ddd;">${product.in_hand_stock ?? 0}</td>
                              <td style="padding: 8px; border: 1px solid #ddd;">
                                  ${product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}
                              </td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
          </div>
      `;

      document.body.appendChild(hiddenContent);

      html2canvas(hiddenContent).then((canvas) => {
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgData = canvas.toDataURL('image/png');

          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let heightLeft = imgHeight;
          let position = 0;

          pdf.text('Product Management Report', 20, 20);

          while (heightLeft > 0) {
              pdf.addImage(imgData, 'PNG', 0, position + 30, imgWidth, imgHeight);

              heightLeft -= 297;
              position -= 297;

              if (heightLeft > 0) {
                  pdf.addPage();
              }
          }

          pdf.save('Product_Details.pdf');
          document.body.removeChild(hiddenContent); 
      }).catch((err) => console.error("Error exporting PDF:", err));
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (product) => {
    if (!product) {
      toast.error("Product data is missing!");
      return;
    }
    
    const productId = product._id || product.id;
    if (!productId) {
      toast.error("Product ID is missing!");
      return;
    }
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };
  



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

      <div  ref={dashboardRef} className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-64 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
      

           <button
          onClick={exportToPDF}
          className="bg-red-600 text-white p-2 rounded-full shadow hover:bg-red-700 transition"
          title="Export to PDF"
        >
          <FaFilePdf size={20} />
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {filteredProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-purple-600 text-white text-left">
              <th className="p-3 cursor-pointer" onClick={() => handleSort("name")}>
                  Product Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "" : "")}
                </th>
                <th className="p-3">Category</th>
                <th className="p-3">Old Stock</th>
                <th className="p-3">New Stock</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Consumed</th>
                <th className="p-3">In-Hand Stock</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="text-gray-700 text-center hover:bg-gray-200">
                  <td className="p-3">{product.name}</td>
                  {/* <td className="p-3">{product.id}</td> */}
                  <td className="p-3">{product.category || "N/A"}</td>
                  <td className="p-3">{product.old_stock ?? 0}</td>
                  <td className="p-3">{product.new_stock ?? 0}</td>
                  <td className="p-3">{product.unit || "N/A"}</td>
                  <td className="p-3">{product.consumed ?? 0}</td>
                  <td className="p-3">{product.in_hand_stock ?? 0}</td>
                  <td className="p-3">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                    
                      onClick={() => {handleOpenEditModal(product);console.log(product+"edit");
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  <button
                      onClick={() => {
                       
                        handleOpenDeleteModal(product.id)}}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
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

      {isEditModalOpen && (
        <EditModal
          product={selectedProduct}
          onConfirm={() => setIsEditModalOpen(false)}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ViewDetails;
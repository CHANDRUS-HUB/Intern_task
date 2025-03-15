import { useEffect, useState, useRef } from "react";
import { getProducts, deleteProduct } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EditModal from "../components/EditModel";
import DeleteConfirmationModal from "../components/DeleteConfirm";
import jsPDF from 'jspdf';
import { FaFilePdf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
// import { debounce } from "lodash"; 


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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchCategory, setSearchCategory] = useState("");
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

  
    // Handle Product Name Search
    const handleSearch = (e) => {
      const value = e.target.value;
      if (/\d/.test(value)) {
        toast.error("Product name should not contain numbers.");
        return;
      }
      setSearchTerm(value);
    };
    
    useEffect(() => {
      if (!searchTerm && !searchCategory) {
        setFilteredProducts(products); // Reset when search is cleared
        return;
      }
    
      const updatedProducts = products.filter(
        (product) =>
          (searchCategory ? product.category.toLowerCase() === searchCategory.toLowerCase() : true) &&
          (searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
      );
    
      setFilteredProducts(updatedProducts);
    }, [searchTerm, searchCategory, products]);
    
     


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
        <h2 style="text-align: center; padding-top:0px ">Product Management Report</h2>
        <br/>
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
        <p style="text-align: right; margin-top: 20px;">Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
    `;

    document.body.appendChild(hiddenContent);

    html2canvas(hiddenContent).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 30;

      pdf.text('Product Management Report', 20, 20);

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

      heightLeft -= 297;
      position += 297;

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= 297;
        position += 297;
      }

      pdf.save('Product_Details.pdf');

      document.body.removeChild(hiddenContent);
    }).catch((err) => console.error("Error exporting PDF:", err));
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };


  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully!");

    } catch (error) {
      toast.error("Error deleting product");
    }
  };





  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  return (
    <>
      <div className="max-w-6xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={() => navigate("/daily-consumption")}
            className="bg-blue-600 text-white font-bold px-3 py-2 ml-0 mr-14 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Update Stock
          </button>
        </div>

        <div ref={dashboardRef} className="mb-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search Product Name"
            value={searchTerm}
           
              onChange={
                handleSearch
              }
              
            className="w-64 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"

          /> 
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white font-semibold px-2 py-2 rounded flex items-center gap-2 shadow-md hover:bg-red-700 transition"
            title="Export to PDF"
          >
            <FaFilePdf  />PDF
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Loading products...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {paginatedProducts.length > 0 ? (
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
                {paginatedProducts.map((product) => (
                  <tr key={product._id} className="text-gray-700 border-solid text-center hover:bg-gray-200">
                    <td className="p-3 border-solid">{product.name.charAt(0).toUpperCase() + product.name.slice(1)}</td>
                    <td className="p-3">{product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "N/A"}</td>
                    <td className="p-3">{product.old_stock ?? 0}</td>
                    <td className="p-3">{product.new_stock ?? 0}</td>
                    <td className="p-3">{product.unit ? product.unit.charAt(0).toUpperCase() + product.unit.slice(1) : "N/A"}</td>
                    <td className="p-3">{product.consumed ?? 0}</td>
                    <td className="p-3">{product.in_hand_stock ?? 0}</td>
                    <td className="p-3">
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          handleOpenEditModal(product);
                          console.log(product + "edit");
                        }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(product.id);
                        }}
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

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

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
    </>
  );
};

export default ViewDetails;
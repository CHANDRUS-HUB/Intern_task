import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { baseurl } from "../URL/url";
// import { FaFilePdf } from 'react-icons/fa'; // For PDF icon
import { useRef } from 'react'; // For PDF export
// import { toPng } from 'html-to-image'; // Alternative for PDF export
// import jsPDF from 'jspdf'; // For PDF generation
// import axios from 'axios'; 
import PDFExportButton from '../components/Pdfexport'
// import html2canvas from 'html2canvas';

const ViewDetails = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setUniqueProductNames] = useState([]);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        console.log("Fetched products:", data);
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


  const handleSearch = (e) => {
    const value = e.target.value;


    if (/\d/.test(value)) {
      toast.error("Product name should not contain numbers.");
      return;
    }

    setSearchTerm(value);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const contentRef = useRef();

//   const exportToPDF = () => {
//     const hiddenContent = document.createElement('div');
//     hiddenContent.innerHTML = `
//         <div id="hidden-content">
//             <h2 style="text-align: center;padding-buttom:">Product Management Report</h2>
//             <table style="width: 100%; border-collapse: collapse;">
//                 <thead>
//                     <tr style="background-color: #6b46c1; color: #fff;">
//                         <th style="padding: 8px; border: 1px solid #ddd;">Product Name</th>
//                         <th style="padding: 8px; border: 1px solid #ddd;">Category</th>
//                         <th style="padding: 8px; border: 1px solid #ddd;">Old Stock</th>
//                         <th style="padding: 8px; border: 1px solid #ddd;">New Stock</th>
//                         <th style="padding: 8px; border: 1px solid #ddd;">Unit</th>
//                         <th style="padding: 8px; border: 1px solid #ddd;">Consumed</th>
//                         <th style="padding: 8px; border: 1px solid #ddd;">In-Hand Stock</th>
//                         <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${products.map(product => `
//                         <tr>
//                             <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
//                             <td style="padding: 8px; border: 1px solid #ddd;">${product.category || "N/A"}</td>
//                             <td style="padding: 8px; border: 1px solid #ddd;">${product.old_stock ?? 0}</td>
//                             <td style="padding: 8px; border: 1px solid #ddd;">${product.new_stock ?? 0}</td>
//                             <td style="padding: 8px; border: 1px solid #ddd;">${product.unit || "N/A"}</td>
//                             <td style="padding: 8px; border: 1px solid #ddd;">${product.consumed ?? 0}</td>
//                             <td style="padding: 8px; border: 1px solid #ddd;">${product.in_hand_stock ?? 0}</td>
//                             <td style="padding: 8px; border: 1px solid #ddd;">
//                                 ${product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}
//                             </td>
//                         </tr>
//                     `).join('')}
//                 </tbody>
//             </table>
//         </div>
//     `;

//     document.body.appendChild(hiddenContent);

//     html2canvas(hiddenContent).then((canvas) => {
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         const imgData = canvas.toDataURL('image/png');

//         const imgWidth = 210;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;

//         let heightLeft = imgHeight;
//         let position = 0;

//         pdf.text('Product Management Report', 20, 20);

//         while (heightLeft > 0) {
//             pdf.addImage(imgData, 'PNG', 0, position + 30, imgWidth, imgHeight);

//             heightLeft -= 297;
//             position -= 297;

//             if (heightLeft > 0) {
//                 pdf.addPage();
//             }
//         }

//         pdf.save('Product_Details.pdf');
//         document.body.removeChild(hiddenContent); 
//     }).catch((err) => console.error("Error exporting PDF:", err));
// };


//   const handleDownloadPDF = async () => {
//     try {
//         const response = await axios.get(`${baseurl}/export-pdf`, {
//             responseType: 'blob', // Important for file download
//         });

//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'Product_Report.pdf');
//         document.body.appendChild(link);
//         link.click();
//     } catch (error) {
//         console.error("Error downloading PDF:", error);
//     }
// };



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
          className="w-64 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        {/* <button
          onClick={exportToPDF}
          className="bg-red-600 text-white p-2 rounded-full shadow hover:bg-red-700 transition"
          title="Export to PDF"
        >
          <FaFilePdf size={20} />
        </button> */}
           <PDFExportButton />
        {/* <select
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        >
          <option value="">Select a Product</option>
          {uniqueProductNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select> */}
      </div>

      {loading && <p className="text-center text-gray-500">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {filteredProducts.length > 0 ? (
        <div ref={contentRef} className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-purple-600 text-white text-left">
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Old Stock</th>
                <th className="p-3">New Stock</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Consumed</th>
                <th className="p-3">In-Hand Stock</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className={`text-gray-700 text-center ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-center text-gray-800 ">No products available.</p>
      )}


      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">


          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
           
            disabled={currentPage === 1}
          >
         
          </button>


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


          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
           
            disabled={currentPage === totalPages}
          >
          
          </button>
        </div>
      )}

    </div>
  );
};

export default ViewDetails;

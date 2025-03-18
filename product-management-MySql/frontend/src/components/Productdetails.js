import { useEffect, useState, useRef } from "react";
import { getProducts, deleteProduct } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EditModal from "../components/EditModel";

import jsPDF from 'jspdf';
import { FaFilePdf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import Editbtn from '../assets/edit.png';
import Deletebtn from '../assets/delete.png';
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs';
import { IoSearchSharp } from "react-icons/io5";
import {

  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  TablePagination
} from '@mui/material';

const ViewDetails = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const [currentPage,] = useState(1);
  const itemsPerPage = 10;
  const [, setOrder] = useState("asc");
  const [, setOrderBy] = useState("");
  const dashboardRef = useRef(null);
  const [orderBy,] = useState("");
  const [order,] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts({ withCredentials: true });
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
      toast.error("Search term should not contain numbers.");
      return;
    }
    setSearchTerm(value);
  };

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    const updatedProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(updatedProducts);
  }, [searchTerm, products]);


  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";

    const sortedData = [...filteredProducts].sort((a, b) => {
      if (column === "Date") {
        return isAsc
          ? dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
          : dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
      }

      if (column === "Time") {
        return isAsc
          ? dayjs(a.createdAt).hour() * 60 + dayjs(a.createdAt).minute() -
          (dayjs(b.createdAt).hour() * 60 + dayjs(b.createdAt).minute())
          : dayjs(b.createdAt).hour() * 60 + dayjs(b.createdAt).minute() -
          (dayjs(a.createdAt).hour() * 60 + dayjs(a.createdAt).minute());
      }

      return a[column]?.toString().localeCompare(b[column]?.toString());
    });

    setFilteredProducts(sortedData);
    setOrderBy(column);
    setOrder(isAsc ? "desc" : "asc");
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
               <th style="padding: 8px; border: 1px solid #ddd;">S.NO</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Product Name</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Category</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Old Stock</th>
              <th style="padding: 8px; border: 1px solid #ddd;">New Stock</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Unit</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Consumed</th>
              <th style="padding: 8px; border: 1px solid #ddd;">In-Hand Stock</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Time</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((product, index)=> `
              <tr>
               <td style="padding: 8px; border: 1px solid #ddd;">${index+1}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${product.category || "N/A"}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${product.old_stock ?? 0}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${product.new_stock ?? 0}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${product.unit || "N/A"}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${product.consumed ?? 0}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${product.in_hand_stock ?? 0}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                   ${product.createdAt
        ? dayjs(product.createdAt).format("DD/MM/YYYY")
        : "-"}
                </td>
                <td style="padding: 8px; border: 1px solid #ddd;">
            ${product.createdAt
        ? dayjs(product.createdAt).format("hh:mm A")
        : "-"}
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

  //   const handleConfirmEdit = async () => {
  //     try {
  //         console.log("Selected Product Data Before Sending:", selectedProduct);

  //         await updateProductInMySQL(
  //             selectedProduct.id,                 // Ensure this is a valid number
  //             Number(selectedProduct.new_stock),   // Ensure this is converted to a number
  //             Number(selectedProduct.consumed),    // Ensure this is converted to a number
  //             Number(selectedProduct.in_hand_stock), // Ensure this is converted to a number
  //             () => toast.success("Product updated successfully!")
  //         );

  //         setIsEditModalOpen(false);  // Close modal after successful update
  //     } catch (error) {
  //         console.error("Error updating product:", error);
  //         toast.error("Error updating product. Please try again.");
  //     }
  // };


  // Correct implementation for initial load



  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(selectedProduct.id);

      setProducts((prevProducts) =>
        prevProducts.filter(product => product.id !== selectedProduct.id)
      );

      toast.success("Product deleted successfully!");
      setShowDeleteModel(false);
    } catch (error) {
      toast.error("Error deleting product.");
    }
  };


  const handleDeleteClick = (product) => {
    setSelectedProduct(product); // Set selected product for confirmation
    setShowDeleteModel(true); // Show confirmation modal
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="mt-2 flex items-center justify-between">
        <h2 className="text-3xl font-bold ml-10 text-gray-800">Product Details</h2>
        <button
          onClick={() => navigate("/daily-consumption")}
          className="bg-gray-600 mt-2 text-white font-bold px-3 py-2 ml-0 mr-14 rounded-lg shadow hover:bg-gray-700 transition"
        >
          Update Stock
        </button>
      </div>
      {loading && <p className="text-center text-gray-500">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="overflow-x-auto ml-8">
        <div ref={dashboardRef} className="mb-4 flex items-center mt-2 gap-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search Product And Category"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
            <IoSearchSharp className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="grid grid-cols-1">
            <div>{/* Your product display area */}</div>
            <div className="text-right">
              {filteredProducts.length === 0 && (
                <p className="text-red-500">No products found.</p>
              )}
            </div>
          </div>

          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white font-semibold px-2 py-2 rounded flex items-center gap-2 shadow-md hover:bg-red-700 transition"
            title="Export to PDF"
          >
            <FaFilePdf />PDF
          </button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-200">
                {[
                  "name",
                  "category",
                  "old_stock",
                  "new_stock",
                  "unit",
                  "consumed",
                  "in_hand_stock",
                  "Date",
                  "Time",
                  "Actions",
                ].map((column) => (
                  <TableCell key={column}>
                    <TableSortLabel
                      active={orderBy === column}
                      direction={orderBy === column ? order : "asc"}
                      onClick={() => handleSort(column)}
                    >
                      {column.replace("_", " ").toUpperCase()}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="font-medium">

              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell >{product.category || "N/A"}</TableCell>
                    <TableCell>{product.old_stock ?? 0}</TableCell>
                    <TableCell>{product.new_stock ?? 0}</TableCell>
                    <TableCell>{product.unit || "N/A"}</TableCell>
                    <TableCell>{product.consumed ?? 0}</TableCell>
                    <TableCell>{product.in_hand_stock ?? 0}</TableCell>

                    <TableCell>
                      {product.createdAt
                        ? dayjs(product.createdAt).format("DD/MM/YYYY")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {product.createdAt
                        ? dayjs(product.createdAt).format("hh:mm A")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="p-3 flex gap-2 justify-center">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="text-white px-4 py-2 rounded-lg "
                        >
                          <img src={Editbtn} className="h-5 w-5" alt="edit" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-white px-4 py-2 rounded-lg"
                        >
                          <img src={Deletebtn} className="h-5 w-5" alt="delete" />
                        </button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>



        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </div>




      {isEditModalOpen && (
        <EditModal
          product={selectedProduct}
          onConfirm={() => setIsEditModalOpen(false)}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}


      {showDeleteModel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold text-gray-700">
              Are you sure you want to delete this product?
            </h3>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 mr-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModel(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ViewDetails;

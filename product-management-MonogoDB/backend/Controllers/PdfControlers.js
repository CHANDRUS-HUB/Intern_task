const PDFDocument = require('pdfkit');
const Product = require("../Models/ProductModel");
const fs = require('fs');
const path = require('path');


const exportPDF = async (req, res) => {
    try {
        const products = await Product.find();
      
        const exportDir  = path.join(__dirname, "../exports");


        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const filePath = path.join(exportDir, "Product_List.pdf");

        const doc = new PDFDocument();


        // Pipe the PDF to the response
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=Product_List.pdf");

        doc.pipe(fs.createWriteStream(filePath));
        doc.pipe(res);

        doc.fontSize(14).text("Product List", { align: "center" });
        doc.moveDown();

        products.forEach((product, index) => {
            doc.fontSize(10).text(
                `${index + 1}. ${product.name} | Category: ${product.category} | Old Stock: ${product.old_stock} | New Stock: ${product.new_stock} | Consumed: ${product.consumed} | In-Hand-Stock: ${product.in_hand_stock} | Date: ${product.date}`
            );
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error("Error exporting PDF:", error);
        res.status(500).json({ message: "Error exporting PDF" });
    }
};
module.exports = {exportPDF}



const PDFDocument = require('pdfkit');
const Product = require("../Models/ProductModel");

const generatePDF = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: 1 });

        if (!products.length) {
            return res.status(404).json({ error: "No products found to generate PDF." });
        }

        const doc = new PDFDocument({ margin: 30 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Product_Report.pdf"');

        doc.pipe(res);

        doc.fontSize(20).text('Product Management Report', { align: 'center' }).moveDown(2);

        // Table Headers
        const tableHeaders = [
            { text: 'Product Name', width: 150 },
            { text: 'Category', width: 100 },
            { text: 'Old Stock', width: 80 },
            { text: 'New Stock', width: 80 },
            { text: 'In-Hand Stock', width: 100 },
        ];

        doc.fontSize(12).font('Helvetica-Bold');
        let startX = 50;
        tableHeaders.forEach(header => {
            doc.text(header.text, startX, doc.y, { width: header.width, continued: true });
            startX += header.width;
        });

        doc.moveDown(0.5).font('Helvetica');

        // Product Data Rows
        products.forEach(product => {
            let startX = 50;
            const rowData = [
                product.name,
                product.category || '- ',
                product.old_stock.toString(),
                product.new_stock.toString(),
                product.in_hand_stock.toString(),
            ];

            rowData.forEach((data, index) => {
                doc.text(data, startX, doc.y, { width: tableHeaders[index].width, continued: true });
                startX += tableHeaders[index].width;
            });
            doc.moveDown(0.5);
        });

        // Footer
        doc.moveDown(2).fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });

        doc.end();

    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Failed to generate PDF report." });
    }
};

module.exports = { generatePDF };

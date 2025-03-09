const PDFDocument = require('pdfkit');
const Product = require("../Models/ProductModel"); 


const generatePDF = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: 1 });

        if (!products.length) {
            console.log(error)
            return res.status(404).json({ error: "No products found to generate PDF." });
        }

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Product_Report.pdf"');

        doc.pipe(res);

        doc.fontSize(20).text('Product Management Report', { align: 'center' }).moveDown(2);

        
        doc
            .fontSize(12)
            .text('Product Name', 50, doc.y, { width: 120, bold: true })
            .text('Category', 200, doc.y, { width: 100, bold: true })
            .text('Old Stock', 320, doc.y, { width: 80, bold: true })
            .text('New Stock', 420, doc.y, { width: 80, bold: true })
            .text('In-Hand Stock', 520, doc.y, { width: 100, bold: true })
            .moveDown(0.5);

        
        products.forEach(product => {
            doc
                .fontSize(10)
                .text(product.name, 50, doc.y)
                .text(product.category || '-', 200)
                .text(product.old_stock.toString(), 320)
                .text(product.new_stock.toString(), 420)
                .text(product.in_hand_stock.toString(), 520)
                .moveDown(0.5);
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

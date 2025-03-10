import React from 'react';
import { downloadPDF } from '../api/productApi';
import Button from '../ui/button'; // Assuming shadcn/ui for consistent design
import { toast } from 'react-toastify';

const PDFExportButton = () => {
    const handleExport = async () => {
        await downloadPDF();
        toast.success('PDF downloaded successfully!');
    };

    return (
        <div className="flex justify-center mt-4">
            <Button
                className="bg-blue-500 text-white hover:bg-blue-600 rounded-2xl px-4 py-2"
                onClick={handleExport}
            >
                Export Product List as PDF
            </Button>
        </div>
    );
};

export default PDFExportButton;

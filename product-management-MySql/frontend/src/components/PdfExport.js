import React from 'react';
import { downloadPDF } from '../api/productApi';
import Button from '../ui/button'; // Assuming shadcn/ui for consistent design
import { toast } from 'react-toastify';
import { FaFilePdf } from 'react-icons/fa';
const PDFExportButton = () => {
    const handleExport = async () => {
        await downloadPDF();
        toast.success('PDF downloaded successfully!');
    };

    return (
        <div className="flex justify-center mt-2">
            <Button
                className="bg-red-500 text-white hover:bg-red-900 rounded-2xl px-4 py-2"
                onClick={handleExport} 
            >
                 <FaFilePdf title="Export to PDF" className=" "    size={20} />
            </Button>
        </div>
    );
};

export default PDFExportButton;
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { baseurl } from "../URL/url";

const EditModal = ({ product, onConfirm, onCancel }) => {
    // Add a null check before accessing product properties
    const [newStock, setNewStock] = useState(product?.new_stock || 0);
    const [consumed, setConsumed] = useState(product?.consumed || 0);

    const oldStock = Number(product?.old_stock) || 0;

    const availableStock = oldStock + Number(newStock);
    const inHandStock = Math.max(availableStock - Number(consumed), 0);

    useEffect(() => {
        if (!product) {
            toast.error("Invalid product data. Please try again.");
            onCancel(); // Close modal if product data is missing
        }
    }, [product]);

    const updateProductInMySQL = async () => {
        try {
            
            const response = await fetch(`${baseurl}/history/${product.id}`, {
                
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    new_stock: Number(newStock),
                    consumed: Number(consumed),
                    in_hand_stock: inHandStock
                }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to update product.");

            toast.success("Product updated successfully.");
            onConfirm({ newStock, consumed, inHandStock });
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Error updating product. Please try again.");
        }
    };

    const handleConfirm = () => {
        if (newStock < 0 || consumed < 0) {
            toast.error("Stock and consumption values cannot be negative.");
            return;
        }

        if (isNaN(newStock) || isNaN(consumed)) {
            toast.error("Please enter valid numbers for stock and consumption.");
            return;
        }

        if (Number(consumed) > availableStock) {
            toast.error("Consumption cannot exceed available stock.");
            return;
        }

        updateProductInMySQL();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Edit Product Details</h2>

                <div className="text-left space-y-3">
                    <p><strong>Product Name:</strong> {product?.name || "N/A"}</p>
                    <p><strong>Category:</strong> {product?.category || "N/A"}</p>
                    <p><strong>Old Stock:</strong> {oldStock}</p>

                    {/* New Stock Input */}
                    <div>
                        <label className="block font-medium">New Stock</label>
                        <input
                            type="number"
                            value={newStock}
                            onChange={(e) => setNewStock(Math.max(0, Number(e.target.value)))}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    {/* Consumed Input */}
                    <div>
                        <label className="block font-medium">Consumed</label>
                        <input
                            type="number"
                            value={consumed}
                            onChange={(e) => setConsumed(Math.max(0, Number(e.target.value)))}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <p className="mt-2">
                        <strong>In-Hand Stock:</strong> {inHandStock}
                    </p>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-center gap-4">
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 rounded-lg text-white ${consumed > availableStock
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        disabled={consumed > availableStock}
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;

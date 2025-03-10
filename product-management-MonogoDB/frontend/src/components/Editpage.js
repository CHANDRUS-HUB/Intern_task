import React, { useState } from "react";

const EditModal = ({ product, onConfirm, onCancel }) => {
  const [newStock, setNewStock] = useState(product.newStock || 0);
  const [consumed, setConsumed] = useState(product.consumed || 0);

  const oldStock = Number(product.oldStock) || 0;

  // Calculate In-Hand Stock with a minimum value of 0
  const availableStock = oldStock + Number(newStock);
  const inHandStock = Math.max(availableStock - Number(consumed), 0);

  // Validation
  const handleConfirm = () => {
    if (consumed > availableStock) {
      alert("Consumption cannot exceed available stock.");
      return;
    }
    onConfirm({ newStock, consumed });
  };

return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Product Details</h2>

            <div className="text-left space-y-3">
                <p><strong>Product Name:</strong> {product.name.charAt(0).toUpperCase() + product.name.slice(1)}</p>
                <p><strong>Category:</strong> {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                <p><strong>Old Stock:</strong> {oldStock}</p>

                {/* New Stock Input */}
                <div>
                    <label className="block font-medium">New Stock</label>
                    <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(Number(e.target.value))}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {/* Consumed Input */}
                <div>
                    <label className="block font-medium">Consumed</label>
                    <input
                        type="number"
                        value={consumed}
                        onChange={(e) => setConsumed(Number(e.target.value))}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {/* Auto-calculated In-Hand Stock */}
                <p className="mt-2">
                    <strong>In-Hand Stock:</strong> {inHandStock}
                </p>
            </div>

            <div className="mt-4 flex justify-center gap-4">
                <button
                    onClick={handleConfirm}
                    className={`px-4 py-2 rounded-lg text-white ${consumed > availableStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
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

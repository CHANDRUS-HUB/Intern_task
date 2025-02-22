import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function App() {
    const [product, setProduct] = useState("");
    const [consume, setConsume] = useState("");
    const [inhand, setInhand] = useState("");
    const [quantity, setQuantity] = useState("");
    const [todos, setTodos] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const appUrl = "http://localhost:8000";
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editId, setEditId] = useState(-1);
    const [editProduct, setEditProduct] = useState("");
    const [editConsume, setEditConsume] = useState("");
    const [editInhand, setEditInhand] = useState("");
    const [editQuantity, setEditQuantity] = useState("");

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(appUrl + "/todos")
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch((err) => {
                setError("Unable to fetch Todo items");
                console.error("Error:", err);
            });
    };


    const handleSubmit = () => {
        setError("");
        if (
            product.trim() !== "" &&
            consume.trim() !== "" &&
            (typeof inhand === 'string' ? inhand.trim() !== "" : inhand !== "") &&
            quantity.trim() !== ""
        ) {
            if (parseInt(consume) > parseInt(quantity)) {
                setError("Consumed value cannot be greater than Quantity.");
                return;
            }

            fetch(appUrl + "/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product, quantity, consume, inhand }),
            })
                .then((res) => res.json())
                .then(() => {
                    setTodos([...todos, { product, quantity, consume, inhand }]);
                    setProduct("");
                    setConsume("");
                    setInhand("");
                    setQuantity("");
                    setSuccess("Item added successfully");
                    setTimeout(() => setSuccess(""), 3000);
                })
                .catch((err) => {
                    setError("Unable to create Todo item");
                    console.error("Error:", err);
                });
        } else {
            setError("Please fill in all fields.");
        }
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditProduct(item.product);
        setEditQuantity(item.quantity);
        setEditConsume(item.consume);
        setEditInhand(item.inhand);
    };

    const handleEditCancel = () => {
        setEditId(-1);
        setEditProduct("");
        setEditQuantity("");
        setEditConsume("");
        setEditInhand("");
    };

    const handleUpdate = () => {
        setError("");
        const updatedFields = {};
        if (editProduct.trim()) updatedFields.product = editProduct;
        if (editQuantity.toString().trim()) updatedFields.quantity = editQuantity;
        if (editConsume.toString().trim()) updatedFields.consume = editConsume;
        if (editInhand.toString().trim()) updatedFields.inhand = editInhand;

        if (Object.keys(updatedFields).length > 0) {
            if (editProduct.trim() === "" || editQuantity.toString().trim() === "" || editConsume.toString().trim() === "" || editInhand.toString().trim() === "") {
                setError("Please fill in all fields.");
                return;
            }

            if (parseInt(editConsume) > parseInt(editQuantity)) {
                setError("Consumed value cannot be greater than Quantity.");
                return;
            }

            fetch(appUrl + "/todos/" + editId, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFields),
            })
                .then((res) => res.json())
                .then(() => {
                    setTodos(todos.map((item) =>
                        item._id === editId
                            ? { ...item, ...updatedFields }
                            : item
                    ));
                    setSuccess("Item updated successfully");
                    setTimeout(() => setSuccess(""), 3000);
                    handleEditCancel();
                })
                .catch((err) => {
                    setError("Unable to update Todo item");
                    console.error("Error:", err);
                });
        } else {
            setError("No changes detected.");
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            fetch(appUrl + "/todos/" + id, { method: "DELETE" })
                .then(() => {
                    setTodos(todos.filter((item) => item._id !== id));
                    if (selectedProduct && selectedProduct._id === id) {
                        setSelectedProduct(null);
                    }
                })
                .catch((err) => {
                    setError("Unable to delete Todo item");
                    console.error("Error:", err);
                });
        }
    };

    const handleViewChart = (item) => {
        setSelectedProduct(item);
    };

    const handleQuantityChange = (e) => {
        const newQuantity = e.target.value;
        setQuantity(newQuantity);
        if (newQuantity && consume) {
            const newInhand = newQuantity - consume;
            setInhand(newInhand);
        }
    };

    const handleConsumeChange = (e) => {
        const newConsume = e.target.value;
        setConsume(newConsume);
        if (quantity && newConsume) {
            const newInhand = quantity - newConsume;
            setInhand(newInhand);
        }
    };

    const handleEditQuantityChange = (e) => {
        const newQuantity = e.target.value;
        setEditQuantity(newQuantity);
        if (newQuantity && editConsume) {
            const newInhand = newQuantity - editConsume;
            setEditInhand(newInhand);
        }
    };

    const handleEditConsumeChange = (e) => {
        const newConsume = e.target.value;
        setEditConsume(newConsume);
        if (editQuantity && newConsume) {
            const newInhand = editQuantity - newConsume;
            setEditInhand(newInhand);
        }
    };

    const chartData = selectedProduct ? {
        labels: ["Purchased", "Consumed", "In-Hand"],
        datasets: [
            {
                label: selectedProduct.product,
                data: [
                    selectedProduct.quantity,
                    parseInt(selectedProduct.consume || 0),
                    parseInt(selectedProduct.inhand || 0),
                ],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    } : {};

    return (
        <>
            <div className="container p-4 bg-light">
                <div className="row p-3 bg-primary text-light text-center">
                    <h1>Product Management System</h1>
                    <p>Manage your products effectively</p>
                </div>

                <div className="row mt-4">
                    <h3 className="text-info">Add a New Product</h3>
                    {success && <p className="text-success">{success}</p>}
                    <div className="form-group d-flex gap-2">
                        <input
                            placeholder="Product Name"
                            className="form-control mb-2"
                            onChange={(e) => setProduct(e.target.value)}
                            value={product}
                        />
                        <input
                            placeholder="Quantity"
                            className="form-control mb-2"
                            type="number"
                            onChange={handleQuantityChange}
                            value={quantity}
                        />

                        <input
                            placeholder="Consumed"
                            className="form-control mb-2"
                            type="number"
                            onChange={handleConsumeChange}
                            value={consume}
                        />

                        <input
                            placeholder="In-Hand"
                            className="form-control mb-2"
                            type="number"
                            value={inhand}
                            readOnly
                        />
                        <button onClick={handleSubmit} className="btn btn-success mb-2">Add Product</button>
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                </div>

                <div className="row mt-4">
                    <h3 className="text-info">Product List</h3>
                    <div className="row">
                        {todos.length === 0 && <p>No Products Added</p>}
                        {todos.map((item) => (
                            <div key={item._id} className="col-md-3">
                                <div className="card">
                                    <div className="card-body">
                                        {editId === item._id ? (
                                            <>
                                                <input
                                                    placeholder="Product Name"
                                                    className="form-control mb-2"
                                                    onChange={(e) => setEditProduct(e.target.value)}
                                                    value={editProduct}
                                                />
                                                <input
                                                    placeholder="Quantity"
                                                    className="form-control mb-2"
                                                    type="number"
                                                    onChange={handleEditQuantityChange}
                                                    value={editQuantity}
                                                />
                                                <input
                                                    placeholder="Consumed"
                                                    className="form-control mb-2"
                                                    type="number"
                                                    onChange={handleEditConsumeChange}
                                                    value={editConsume}
                                                />
                                                <input
                                                    placeholder="In-Hand"
                                                    className="form-control mb-2"
                                                    type="number"
                                                    value={editInhand}
                                                    readOnly
                                                />
                                                <button className="btn btn-success m-2" onClick={handleUpdate}>
                                                    Update
                                                </button>
                                                <button className="btn btn-secondary" onClick={handleEditCancel}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <h5 className="card-title">{item.product}</h5>
                                                <p className="card-text">Quantity: {item.quantity}</p>
                                                <p className="card-text">Consumed: {item.consume}</p>
                                                <p className="card-text">In Hand : {item.inhand}</p>
                                                <button className="btn btn-primary" onClick={() => handleEdit(item)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-danger m-2" onClick={() => handleDelete(item._id)}>
                                                    Delete
                                                </button>
                                                <button className="btn btn-info p" onClick={() => handleViewChart(item)}>
                                                    View Chart
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedProduct && (
                    <div className="row mt-4">
                        <h3 className="text-info">Product Chart</h3>
                        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                            <Bar data={chartData} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

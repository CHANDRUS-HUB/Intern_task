const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  

const app = express();

// Middleware
app.use(express.json()); // To parse JSON request body
app.use(cors()); // To handle CORS issues

// MongoDB URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-app';

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => {
        console.log('DB Connected');
    })
    .catch((err) => {
        console.log('DB Connection Error: ', err); 
    });

// Schema for Todo
const todoschema = new mongoose.Schema({
    product: {
        required: true,
        type: String,
    },
    quantity: {
        required: true,
        type: Number,
    },
    consume: {
        type: Number,  
        default: 0,
    },
    inhand: {
        type: Number,  
        default: 0,
    },
});

// Model for Todo
const todoModel = mongoose.model('Todo', todoschema);

// Routes
app.get('/todos', (req, res) => {
    todoModel.find()
        .then((result) => res.json(result))
        .catch((err) => res.status(500).json({ message: 'Error fetching todos', error: err.message }));
});

app.post('/todos', async (req, res) => {
    const { product, quantity, consume, inhand } = req.body;
    try {
        if (!product || !quantity) {
            return res.status(400).json({ message: "Product and quantity are required" });
        }

        const newTodo = new todoModel({
            product,
            quantity,
            consume: consume || 0,
            inhand: inhand || 0,
        });

        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating Todo: ', error);
        res.status(500).json({ message: 'Error creating Todo', error: error.message });
    }
});

// PUT route for updating Todo
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { product, quantity, consume, inhand } = req.body;

    try {
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { product, quantity, consume, inhand },
            { new: true }
        );
        
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ message: 'Error updating Todo', error: err.message });
    }
});

// DELETE route for deleting Todo
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await todoModel.findByIdAndDelete(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting Todo', error: err.message });
    }
});

// Server Setup
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

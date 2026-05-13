//index.js
const connectDB = require('./config/db');
const express = require('express');
const Expense = require('./models/Expense');
const cors = require('cors');
// const crypto = require('crypto');


const app = express();

//middleware
app.use(cors());
app.use(express.json());
connectDB();

//data
// const expenses = [];

//routes
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//post api
app.post('/api/expenses', async (req, res) => {
    const { title, amount, category, date } = req.body;

    const newExpense = new Expense({
        title,
        amount,
        category,
        date
    });

    try {
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//put api
app.put('/api/expenses/:id', async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Taaki update hone ke baad naya data return ho
        );
        res.json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//delete api
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
   

//start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
}); 
//index.js
require('dotenv').config(); //VERY IMPORTANT For JWT Token in AuthRoutes.js:
const protect = require('./middleware/authMiddleware');
const connectDB = require('./config/db');
const express = require('express');
const mongoose = require('mongoose');
const Expense = require('./models/Expense');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
// const crypto = require('crypto');


const app = express();

//middleware
app.use(cors());
app.use(express.json());
connectDB();

//auth routes import
app.use('/api/auth', authRoutes);

//data
// const expenses = [];

app.get('/', (req, res) => {
    res.send('Backend is running');
});

//routes
// app.get('/api/expenses', async (req, res) => {
app.get('/api/expenses', protect, async (req, res) => {
    try {
        // const expenses = await Expense.find().sort({ createdAt: -1 });
        const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//post api
app.post('/api/expenses', protect, async (req, res) => {
    const { title, amount, category, date } = req.body;
    // newExpense.
    const newExpense = new Expense({
        title,
        amount,
        category,
        date,
        user: req.user.id //req.user._id comes from your auth middleware → it knows who is logged in.
    });

    try {
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//put api
app.put('/api/expenses/:id', protect, async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found or not authorized' });
        }
        res.json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//delete api
app.delete('/api/expenses/:id', protect, async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found or not authorized' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//fixing
// app.get('/fix-expenses', async (req, res) => {
//     const result = await Expense.updateMany(
//         { user: { $exists: false } },
//         { $set: { user: new mongoose.Types.ObjectId('6a0c3814ea34b79dbc1db03f') } }
//     );
//     res.json({ fixed: result.modifiedCount });
// });


//start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
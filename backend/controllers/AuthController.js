//AuthController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        //check existing user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        //hashed password
        // const salt = await bcrypt.genSalt(10);
        //const hashedPassword = await bcrypt.hash(password, salt);
        //schema middleware already hashes password
        //create user
        const user = await User.create({
            username,
            email,
            password
            //password: hashedPassword
        });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        //check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Email' });
        }
        //check password
        // const isMatch = await user.matchPassword(password);
        // if (!isMatch) {
        //     return res.status(401).json({ message: 'Invalid Password' });
        // }
        console.log("Entered Password:", password);

        console.log("DB Password:", user.password);

        const isMatch = await user.matchPassword(password);

        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Password' });
        }
        //generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your-strong-secret-key',
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: 'User logged in successfully',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed' });
    }
};



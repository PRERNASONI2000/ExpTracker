//authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {

    let token;

    // check token exists
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {

        try {

            // get token
            token = req.headers.authorization.split(' ')[1];

            // verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'your-strong-secret-key'
            );

            // get user from token
            req.user = await User.findById(decoded.id).select('-password');

            next();

        } catch (error) {

            console.error(error);

            return res.status(401).json({
                message: 'Not authorized'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }
};

module.exports = protect;
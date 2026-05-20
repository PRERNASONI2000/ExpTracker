//User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'Please enter a username'], unique: true },
    email: { type: String, required: [true, 'Please enter an email'], unique: true },
    password: { type: String, required: [true, 'Please enter a password'] },
},
    { timestamps: true }
);

//password hashing
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
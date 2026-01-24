const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    cookieId: { type: String, required: true, unique: true }, // بصمة الزائر
    ip: String,
    interestScore: { type: Number, default: 0 }, // نقاط الاهتمام (0-100)
    interests: [String], // ما هي الأشياء التي يحبها؟ (مثل: "fashion", "electronics")
    history: [
        {
            event: String, // view, add_to_cart, purchase
            product: String,
            timestamp: { type: Date, default: Date.now }
        }
    ],
    lastActive: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
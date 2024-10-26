const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    email: { type: String, required: true },
    purchased: [
        {
            itemName: { type: String, required: true },
            datePurchased: { type: Date, default: Date.now }
        }
    ]
}, { collection: "last-online" });

const products = mongoose.model("products", productsSchema);

module.exports = products;
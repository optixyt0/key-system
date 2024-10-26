const mongoose = require('mongoose');

const keysSchema = new mongoose.Schema({
    buyerEmail: { type: String, required: true },
    key: { type: String, required: true },
    product: { type: String, required: true },
    redeemer: { type: String },
    redeemed: { type: Boolean, required: true, default: "false" }
}, { collection: "keys" });

const keys = mongoose.model("keys", keysSchema);

module.exports = keys;
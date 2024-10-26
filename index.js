const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app = express();
const keys = require("./models/keys.js");
const products = require("./response/products.json");
const purchased = require("./models/products.js");
const PORT = process.env.PORT || 65532;
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1/Tivan"

function makeKeySection(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

async function connectDB(dbUrl) {
    try {
        await mongoose.connect(dbUrl)
        console.log("Connected to MongoDB!")
    } catch(err) {
        console.log("Failed to connect to MongoDB: " + err)
    }
    
}

app.use(express.json())

app.listen(PORT,  async() => {
    if (isNaN(PORT)) {
        console.log("Port is not set as a number, please use a number.")
    } else {
        console.log("Key System API running on " + PORT);
        await connectDB(DB_URL);
    } 
});

app.post("/add-key", async (req, res) => {
    const { email, item } = req.body;

    if (!products.products.some(product => product.name === item)) {
        return res.status(200).json({ message: "That product does not exist." });
    }

    try {
        const key = makeKeySection(5) + "-" + makeKeySection(5) + "-" + makeKeySection(5) + "-" + makeKeySection(5);
        await keys.create({ buyerEmail: email, key: key, product: item });
        return res.status(200).json({ message: "You have successfully added a key!", key: key });
    } catch(err) {
        console.log("An error has occurred while trying to create a key: " + err);
    }
});

app.post("/add-product-to-user", async (req, res) => {
    const { email, item } = req.body;

    if (!products.products.some(product => product.name === item)) {
        return res.status(200).json({ message: "That product does not exist." });
    }

    try {
        await purchased.create({ email: email, "product.itemName": item });
        return res.status(200).json({ message: "You have successfully added a product to your account!", product: item });
    } catch(err) {
        console.log("An error has occurred while trying to add a product to a user: " + err);
    }

});

app.post("/redeem-key", async (req, res) => {
    const { email, key } = req.body;

    const existingKey = await keys.findOne({ key: key });

    if (!existingKey || existingKey.redeemed) {
        return res.status(404).json({ message: "You have provided an invalid key." });
    } 

    try {
        const updatedUser = await keys.updateOne(
            { key },
            { $set: { redeemer: email, redeemed: true } }
        );
        await purchased.create({ email: email, "product.itemName": existingKey.product });
        return res.status(200).json({ message: "You have successfully redeemed a key for " + existingKey.product + "!" });
    } catch (err) {
        console.log("An error has occurred while trying to redeem a key: " + err);
        return res.status(500).json({ message: "An error occurred while redeeming the key." });
    }
});


app.get("/get-products", (req, res) => {
    return res.status(200).send(products.products)
});

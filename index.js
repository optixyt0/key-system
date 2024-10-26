const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 65532;
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1/Key"; // i was gonna give this to tivan fr
const logger = require("./utils/logger");

async function connectDB(dbUrl) {
    try {
        await mongoose.connect(dbUrl)
        logger.database("Connected to MongoDB!")
    } catch(err) {
        console.error("Failed to connect to MongoDB: " + err)
    }
}

app.use(express.json())
app.use(require("./routes/basic"));

app.listen(PORT,  async() => {
    if (isNaN(PORT)) {
        console.warn("Port is not set as a number, please use a number.")
    } else {
        logger.backend("Key System API running on " + PORT);
        await connectDB(DB_URL);
    } 
});
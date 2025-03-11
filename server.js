const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase URL-encoded payload limit

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.get("/", (req,res)=>{
    res.send("API is running...");
});

const authRoutes = require("./routes/authRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const publicRoutes = require("./routes/publicRoutes.js"); 

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/public", publicRoutes); 

// app.use("/public/uploads", express.static("uploads"));

app.listen(PORT,()=>{
    console.log(`Server is running at ${BASE_URL}`)
});

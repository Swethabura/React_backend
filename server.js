const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

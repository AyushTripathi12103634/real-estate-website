import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propRoutes.js';

// Configuring .env File
dotenv.config();

await connectDB();

const app = express();

app.use(express.json())

app.use(cors());

app.use("/server/api/auth",authRoutes);
app.use("/server/api/prop",propertyRoutes);

app.use("/",(req,res)=>{
    res.send("Backend Running!!!");
});

app.listen(process.env.PORT,()=>{
    console.log(`Server running on Port: ${process.env.PORT}`.bgGreen.white);
    console.log(`Go to: http://localhost:${process.env.PORT}`.bgGreen.white);
});


import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';

import { connectDB } from './db/connectDB.js';

import authRoutes from './routes/auth_route.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(({ origin: "http://localhost:5173", credentials: true })));

app.use(express.json()); //allows us to parse incoming requests :req.body
app.use(cookieParser()); //allows us to parse incoming cookies :req.cookies

app.use("/api/auth",authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log('Server started on port:', PORT);
});

//JZmSGVo65kN6f8uU

// mongodb+srv://hashiniobadage6030:JZmSGVo65kN6f8uU@cluster0.q1wp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
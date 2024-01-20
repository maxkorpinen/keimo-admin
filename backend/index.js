import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";

import unitsRoute from './routes/unitsRoute.js';
import civsRoute from './routes/civsRoute.js';
import authRoute from './routes/authRoute.js';

import verifyToken from "./middleware/authMiddleware.js";

import cors from 'cors';

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy, allowing all origins
//app.use(cors());

// Middleware for handling CORS policy, allowing custom origins
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your React app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('We are live')
});

app.use('/units', verifyToken, unitsRoute);
app.use('/civs', verifyToken, civsRoute);
app.use('/auth', authRoute);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })
import 'dotenv/config.js'
import express from "express";
import { PORT, mongoDBURL, CORS_ORIGIN } from "./config.js";
import mongoose from "mongoose";

import verifyToken from "./middleware/authMiddleware.js";

import unitsRoute from './routes/unitsRoute.js';
import civsRoute from './routes/civsRoute.js';
import authRoute from './routes/authRoute.js';

import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy, allowing all origins
// app.use(cors());

// Middleware for handling CORS policy, allowing custom origins based on environment
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);

        // Define allowed origins for each environment
        const allowedOrigins = {
            development: ['http://localhost:5173'],
            production: [process.env.CORS_ORIGIN]
        };

        // Check if the origin is allowed
        if (allowedOrigins[process.env.NODE_ENV].indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(new Error('CORS Policy Error'), false);
        }
    },
    credentials: true
}));

app.get('/', (request, response) => {
    return response.status(234).send('We are live')
});

app.use('/units', verifyToken, unitsRoute);
app.use('/civs', verifyToken, civsRoute);
app.use('/auth', authRoute);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT || 3000, '0.0.0.0', () => {
            console.log(`App is listening to port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })
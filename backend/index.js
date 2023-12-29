import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import unitsRoute from './routes/unitsRoute.js';
import cors from 'cors';

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy, allowing all origins
app.use(cors());

// Middleware for handling CORS policy, allowing custom origins
/* app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
); */

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('We are live')
});

app.use('/units', unitsRoute)

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
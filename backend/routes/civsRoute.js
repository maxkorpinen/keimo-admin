import express from 'express';
import { Civ } from '../models/civModel.js';
import mongoose from "mongoose";

const router = express.Router();

// Route for saving a new Civ
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.units
        ) {
            return response.status(400).send({
                message: 'Send all required fields: name, and units'
            });
        }
        const newCiv = {
            name: request.body.name,
            units: request.body.units
        }
        const civ = await Civ.create(newCiv);
        return response.status(201).send(civ);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});

// Route for getting all civs
router.get('/', async (request, response) => {
    try {
        const civs = await Civ.find({});
        return response.status(200).json({
            count: civs.length,
            data: civs
        })
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});

// Route for getting a civ by ID
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const civ = await Civ.findById(id);
        return response.status(200).json(civ)
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});

// Route for updating a Civ
router.put('/:id', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.units
        ) {
            return response.status(400).send({
                message: 'Send all required fields: name, and units'
            });
        }
        const { id } = request.params;
        const result = await Civ.findByIdAndUpdate(id, request.body);
        if (!result) {
            return response.status(400).json({ message: error.message })
        }
        return response.status(200).send({ message: 'Civ updated successfully' })
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for deleting a Civ
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Civ.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: 'Civ not found' })
        }
        return response.status(200).send({ message: 'Civ deleted successfully' })
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
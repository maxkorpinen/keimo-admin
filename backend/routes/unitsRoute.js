import express from 'express';
import { Unit } from '../models/unitModel.js';

const router = express.Router();

// Route for saving a new Unit
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.building
        ) {
            return response.status(400).send({
                message: 'Send all required fields: name, building, and isGoldUnit'
            });
        }
        const newUnit = {
            name: request.body.name,
            building: request.body.building,
            isGoldUnit: request.body.isGoldUnit,
            counterOf: request.body.counterOf,
            counteredBy: request.body.counteredBy
        }
        const unit = await Unit.create(newUnit);
        return response.status(201).send(unit);
    } catch(error) {
        console.log(error.message);
        response.status(500).send({message: error.message})
    }
});

// Route for getting all units
router.get('/', async (request, response) => {
    try {
        const units = await Unit.find({});
        return response.status(200).json({
            count: units.length,
            data: units
        })
    } catch(error) {
        console.log(error.message);
        response.status(500).send({message: error.message})
    }
});

// Route for getting a unit by ID
router.get('/:id', async (request, response) => {
    try {
        const {id} = request.params;
        const unit = await Unit.findById(id);
        return response.status(200).json(unit)
    } catch(error) {
        console.log(error.message);
        response.status(500).send({message: error.message})
    }
});

// Route for updating a Unit
router.put('/:id', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.building
        ) {
            return response.status(400).send({
                message: 'Send all required fields: name, building, and isGoldUnit'
            });
        }
        const {id} = request.params;
        const result = await Unit.findByIdAndUpdate(id, request.body)
        if (!result) {
            return response.status(400).json({message: error.message})
        }
        return response.status(200).send({message: 'Unit updated successfully'});
    } catch(error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
})

// Route for deleting a Unit
router.delete('/:id', async (request, response) => {
    try {
        const {id} = request.params;
        const result = await Unit.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({message: 'Unit not found'})
        }
        return response.status(200).send({message: 'Unit deleted successfully'})
    } catch(error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

export default router;
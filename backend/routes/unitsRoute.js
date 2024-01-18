import express from 'express';
import { Unit } from '../models/unitModel.js';
import mongoose from "mongoose";
import multer from 'multer';

const router = express.Router();

const upload = multer({ 
    limits: { fileSize: 2500000 }, // Limit file size 2.5MB
    fileFilter(request, file, cb) {
        //console.log(request.file)
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png).'));
        }
        cb(undefined, true);
    }
});

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
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
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
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});

// Route for getting a unit by ID
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const unit = await Unit.findById(id);
        return response.status(200).json(unit)
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});

// Route for getting Civ image by ID
router.get('/:id/image', async (request, response) => {
    try {
        const unit = await Unit.findById(request.params.id);
        if (!unit || !unit.image) {
            throw new Error('Image not found');
        }
        console.log(unit.image)
        response.set('Content-Type', 'image/jpeg');
        response.send(unit.image);
    } catch (error) {
        console.log(error.message);
        response.status(404).send({ message: error.message });
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
        const { id } = request.params;
        const counterOf = request.body.counterOf
        const counteredBy = request.body.counteredBy

        const currentUnit = await Unit.findById(id);
        if (!currentUnit) {
            return response.status(404).send({ message: 'Unit not found' });
        }

        const addedCounterOf = counterOf.filter(x => !currentUnit.counterOf.includes(x));
        const removedCounterOf = currentUnit.counterOf.filter(x => !counterOf.includes(x));

        const addedCounteredBy = counteredBy.filter(x => !currentUnit.counteredBy.includes(x));
        const removedCounter = currentUnit.counteredBy.filter(x => !counteredBy.includes(x));

        //console.log(addedCounterOf)
        //console.log(removedCounterOf)
        //console.log(addedCounteredBy)
        //console.log(removedCounter)

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // update the current unit
            const result = await Unit.findByIdAndUpdate(id, request.body, { session })
            if (!result) {
                return response.status(400).json({ message: error.message })
            }

            // Update the counteredBy array of units added to counterOf
            for (const counterUnitId of addedCounterOf) {
                await Unit.findByIdAndUpdate(counterUnitId, { $addToSet: { counteredBy: id } }, { session });
            }

            // Update the counteredBy array of units removed from counterOf
            for (const counterUnitId of removedCounterOf) {
                await Unit.findByIdAndUpdate(counterUnitId, { $pull: { counteredBy: id } }, { session });
            }

            // Update the counterOf array of units added to counteredBy
            for (const counterUnitId of addedCounteredBy) {
                await Unit.findByIdAndUpdate(counterUnitId, { $addToSet: { counterOf: id } }, { session });
            }

            // Update the counterOf array of units removed from counteredBy
            for (const counterUnitId of removedCounter) {
                await Unit.findByIdAndUpdate(counterUnitId, { $pull: { counterOf: id } }, { session });
            }

            await session.commitTransaction();
            return response.status(200).send({ message: 'Unit updated successfully' });
        } catch (error) {
            await session.abortTransaction();
            console.log(error.message);
            response.status(500).send({ message: error.message });
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });

    }
});

// Route for unit image upload
router.put('/:id/image', upload.single('image'), async (request, response) => {
    try {
        const unit = await Unit.findById(request.params.id);
        if (!unit) {
            return response.status(404).send({ message: 'Unit not found' });
        }
        unit.image = request.file.buffer;
        //console.log(unit.image)
        await unit.save();
        response.send({ message: 'Unit image uploaded successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for deleting a Unit
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Unit.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: 'Unit not found' })
        }
        return response.status(200).send({ message: 'Unit deleted successfully' })
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
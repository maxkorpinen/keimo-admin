import express from 'express';
import { Unit } from '../models/unitModel.js';
import mongoose from "mongoose";
import multer from 'multer';

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({ region: process.env.AWS_REGION });

const upload = multer({ limits: { fileSize: 2500000 } });

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
            isMeta: request.body.isMeta,
            isUnique: request.body.isUnique,
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
        const imageUrl = unit.image;
        console.log(imageUrl);
        response.send({ imageUrl: imageUrl });
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

        // Check if the old image is a string
        if (typeof unit.image === 'string') {
            // Extract the key of the old image from the image URL
            const oldImageUrl = unit.image;
            const oldImageKey = oldImageUrl.split('.amazonaws.com/')[1];

            // Delete the old image from the S3 bucket
            const deleteParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: oldImageKey.replace(/ /g, '%20') };
            const deleteCommand = new DeleteObjectCommand(deleteParams);
            await s3.send(deleteCommand);
        }

        const key = `${uuidv4()}-${request.file.originalname.replace(/ /g, '_')}`;

        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: request.file.buffer,
            ContentType: request.file.mimetype,
            // ACL: 'public-read'
        };

        const command = new PutObjectCommand(uploadParams);

        await s3.send(command);

        const region = await s3.config.region();
        const imageUrl = `https://${uploadParams.Bucket}.s3.${region}.amazonaws.com/${uploadParams.Key}`;

        unit.image = imageUrl;

        await unit.save();

        response.send({ message: 'Unit image uploaded successfully', imageUrl: imageUrl });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for deleting a Unit
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const unit = await Unit.findById(id);
        if (!unit) {
            return response.status(404).json({ message: 'Unit not found' })
        }
        await Unit.deleteOne({ _id: id }); // Changed to a deleteOne operation on the Unit model

        return response.status(200).send({ message: 'Unit deleted successfully' })
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
import express from 'express';
import { Civ } from '../models/civModel.js';
import multer from 'multer';
// import s3 from '../aws-config.js';

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({ region: process.env.AWS_REGION });

const upload = multer({ limits: { fileSize: 2500000 } });

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
            units: request.body.units,
            description: request.body.description
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
        const civs = await Civ.find({}) // Excludes the image field
        return response.status(200).json({
            count: civs.length,
            data: civs
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
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

// Endpoint for getting Civ image by ID
router.get('/:id/image', async (request, response) => {
    const civ = await Civ.findById(request.params.id);
    if (!civ) {
        return response.status(404).send({ message: 'Civ is not found' });
    }

    const imageUrl = civ.image;

    console.log(imageUrl);
    response.send({ imageUrl: imageUrl });
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

// Endpoint for updating civ image
router.put('/:id/image', upload.single('image'), async (request, response) => {
    try {
        const civ = await Civ.findById(request.params.id);
        if (!civ) {
            return response.status(404).send({ message: 'Civ not found' });
        }

        // Check if the old image is a string
        if (typeof civ.image === 'string') {
            // Extract the key of the old image from the image URL
            const oldImageUrl = civ.image;
            const oldImageKey = oldImageUrl.split('.amazonaws.com/')[1];

            // Delete the old image from the S3 bucket
            const deleteParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: oldImageKey.replace(/ /g, '%20') };
            const deleteCommand = new DeleteObjectCommand(deleteParams);
            await s3.send(deleteCommand);
        }

        const key = `${uuidv4()}-${request.file.originalname.replace(/ /g, '_')}`; // generate a unique key for each image

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
        const imageUrl = `https://${uploadParams.Bucket}.s3.${region}.amazonaws.com/${uploadParams.Key}`; // generate the URL of the uploaded image

        civ.image = imageUrl; // store the image URL in the database instead of the image itself

        await civ.save();

        response.send({ message: 'Civ image uploaded successfully', imageUrl: imageUrl });
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
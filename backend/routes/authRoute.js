import express from 'express';
import { Admin } from '../models/adminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("Email:", email); // Check the received email
    console.log("Password:", password); // Check the received password

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).send('Authentication failed');

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log(admin)

        if (!isMatch) return res.status(401).send('Authentication failed');

        const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

export default router;
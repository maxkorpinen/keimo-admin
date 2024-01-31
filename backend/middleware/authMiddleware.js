import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Extract the token from cookies

    if (!token) {
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        // console.log(verified)
        req.user = verified; // Or whatever user payload you have in the token
        next();
    } catch (error) {
        res.status(403).send('Invalid Token');
    }
};

export default verifyToken;

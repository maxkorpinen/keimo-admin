import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer TOKEN

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send('Token is not valid');
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).send('Authentication token is missing');
    }
};

export default verifyToken;
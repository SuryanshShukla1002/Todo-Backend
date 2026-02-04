import jwt from "jsonwebtoken";
import { errorHandler } from './error.js';

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    // console.log(token)
    if (!token) {
        return next(errorHandler(401, "Unauthorized"));
    }

    jwt.verify(token, process.env.JWT_SECRECT, (err, user) => {
        if (err) {
            return next(errorHandler(404, "Forbidden"));
        }
        req.user = user;
        next();
    });
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ message: "Forbidden" });
    next();
};
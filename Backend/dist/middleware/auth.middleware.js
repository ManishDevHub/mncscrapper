"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../db/prisma"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Bearer token required"
            });
        }
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid token format"
            });
        }
        const token = parts[1];
        const secret = process.env.JWT_SECRET || "secret";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = {
            id: decoded.userId || decoded.id,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role || "user"
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid or expired token"
        });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Authentication required"
            });
        }
        if (req.user.role === "admin") {
            return next();
        }
        // Verify with database in case role was updated
        const dbUser = await prisma_1.default.user.findUnique({
            where: { id: String(req.user.id) },
            select: { role: true }
        });
        if (dbUser && dbUser.role === "admin") {
            req.user.role = "admin";
            return next();
        }
        return res.status(403).json({
            success: false,
            message: "Forbidden - Only administrators can perform this action"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error verifying admin permissions"
        });
    }
};
exports.adminMiddleware = adminMiddleware;

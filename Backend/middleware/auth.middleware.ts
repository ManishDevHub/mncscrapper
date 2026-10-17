import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../db/prisma";

export interface AuthUser {
    id: string | number;
    email: string;
    username?: string;
    role?: string;
}

export interface AuthRequest extends Request {
    user?: AuthUser;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
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

        const decoded = jwt.verify(token, secret) as any;
        req.user = {
            id: decoded.userId || decoded.id,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role || "user"
        };
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid or expired token"
        });
    }
};

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
        const dbUser = await prisma.user.findUnique({
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
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error verifying admin permissions"
        });
    }
};
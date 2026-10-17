import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password, adminSecret, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required',
            });
        }

        const existingUser = await prisma.user.findFirst({ 
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {    
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin secret is provided or first user
        let userRole = "user";
        const totalUsers = await prisma.user.count();
        if (totalUsers === 0 || adminSecret === (process.env.ADMIN_SECRET || "admin123") || role === "admin" && adminSecret === "admin123") {
            userRole = "admin";
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: userRole
            }
        });

        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, username: newUser.username, role: newUser.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        return res.status(201).json({ 
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("signup error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username, role: user.role || 'user' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        return res.status(200).json({ 
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role || 'user'
            }
        });

    } catch (error) {
        console.error("login error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: String(req.user.id) },
            select: { id: true, username: true, email: true, role: true }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("getMe error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const makeAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const { secret, userId } = req.body;
        const validSecret = process.env.ADMIN_SECRET || 'admin123';

        if (secret !== validSecret) {
            return res.status(403).json({ success: false, message: 'Invalid secret key' });
        }

        const targetId = userId || (req.user ? String(req.user.id) : null);
        if (!targetId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const updated = await prisma.user.update({
            where: { id: targetId },
            data: { role: 'admin' },
            select: { id: true, username: true, email: true, role: true }
        });

        return res.status(200).json({
            success: true,
            message: 'User promoted to admin successfully',
            user: updated
        });
    } catch (error) {
        console.error("makeAdmin error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
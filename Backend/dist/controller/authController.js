"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAdmin = exports.getMe = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../db/prisma"));
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required',
            });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email: normalizedEmail },
                    { username: username.trim() }
                ]
            }
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === normalizedEmail ? 'Email already registered' : 'Username already taken'
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Strict security: all signups are strictly regular users.
        // Only the designated admin email receives admin role.
        const adminEmail = (process.env.ADMIN_EMAIL || 'ramuk13476@gmail.com').toLowerCase().trim();
        const userRole = normalizedEmail === adminEmail ? "admin" : "user";
        const newUser = await prisma_1.default.user.create({
            data: {
                username: username.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role: userRole
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, email: newUser.email, username: newUser.username, role: newUser.role }, process.env.JWT_SECRET || 'supersecret_careerhub_jwt_key_2026', { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error("signup error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await prisma_1.default.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, username: user.username, role: user.role || 'user' }, process.env.JWT_SECRET || 'supersecret_careerhub_jwt_key_2026', { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error("login error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const user = await prisma_1.default.user.findUnique({
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
    }
    catch (error) {
        console.error("getMe error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getMe = getMe;
const makeAdmin = async (req, res) => {
    try {
        const { secret, userId } = req.body;
        const validSecret = process.env.ADMIN_SECRET || 'rudra111';
        if (secret !== validSecret) {
            return res.status(403).json({ success: false, message: 'Invalid admin secret passkey' });
        }
        const targetId = userId || (req.user ? String(req.user.id) : null);
        if (!targetId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }
        const updated = await prisma_1.default.user.update({
            where: { id: targetId },
            data: { role: 'admin' },
            select: { id: true, username: true, email: true, role: true }
        });
        return res.status(200).json({
            success: true,
            message: 'User promoted to admin successfully',
            user: updated
        });
    }
    catch (error) {
        console.error("makeAdmin error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.makeAdmin = makeAdmin;

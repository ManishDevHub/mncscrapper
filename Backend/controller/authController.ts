import { Request , Respone } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const  signup = async (req: Request, res: Respone) => {
    try {

        const { username , email , password } = req.body;

        const exitinguser = await User.findOne({ email});

        if(exitinguser){    
            return res.status(400).json({ message: 'User already exists' });
        }
        res.status(201).json({ message: " User created successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

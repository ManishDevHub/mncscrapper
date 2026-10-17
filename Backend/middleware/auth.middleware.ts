
import { Request , Response , NextFunction } from "express"
import jwt from "jsonwebtoken"


interface AuthUser {
    id: string | number;
    email: string;
    username?: string;
}

export interface AuthRequest extends Request {
    user?: AuthUser;
}

export const authMiddleware = ( req: AuthRequest , res: Response , next: NextFunction) => {

    try {
        const authHeader = req.headers.authorization;

        if( !authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false ,
                message: "Unauthorized - Bearer token required"
            })
        }

        const parts = authHeader.split(" ");
        if( parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid token format"
            })
        }

        const token = parts[1];
        const secret = process.env.JWT_SECRET || "secret"

        const decoded = jwt.verify(token , secret) as any;
        req.user = {
            id: decoded.userId || decoded.id,
            email: decoded.email,
            username: decoded.username
        }
        next();

    }catch(error){
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid or expired token"
        })
    }
}

 
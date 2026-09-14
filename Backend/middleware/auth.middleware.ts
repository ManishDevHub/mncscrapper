
import { Request , Response , NextFunction } from "express"
import jwt from "jsonwebtoken"


interface AuthUser {
    id: number;
    email: string;
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
                message: "Unauthorized is required"
            })
        }

        const [ type, token ] = authHeader.split(" ")[1];
        if( type !== "Bearer" || !token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized is required"
            })
        }

        const secret = process.env.JWT_SECRET || "secret"

        const decoded = jwt.verify(token , secret) as AuthUser;
        req.user = {
            id: decoded.id,
            email: decoded.email
        }
        next();





    }catch(error){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
}
 
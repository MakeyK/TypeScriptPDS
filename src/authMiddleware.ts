import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default function (req: Request, res: Response, next: NextFunction): void {
    if (req.method === "OPTIONS") {
        return next(); 
    }
    
    try {
        const token: string | undefined = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: "Не авторизован" });
            return; 
        }

        const decoded: any = jwt.verify(token, process.env.SECRET_KEY as string);
        req.user = decoded;
        next();
    } catch (e) {   
        res.status(401).json({ message: "Ошибка" });
        return;
    }
};

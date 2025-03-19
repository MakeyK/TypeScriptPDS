import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret_key: string | undefined = process.env.SECRET_KEY;

export default function authorize(role: string[]) {
    return function (req: Request, res: Response, next: NextFunction): void {
        if (req.method === 'OPTIONS') {
            return next();
        }

        const token: string | undefined = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Для просмотра данной страницы необходимо авторизоваться' });
            return;
        }

        try {
            const decoded: any = jwt.verify(token, secret_key as string);
            console.log(decoded); 
            const userRole: string = decoded.role;

            if (!role.includes(userRole) && userRole !== 'admin') {
                console.log(role);
                console.log(userRole);
                res.status(403).json({ message: 'Нет доступа для просмотра данной страницы' });
                return;
            }

            req.user = decoded; 
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Ошибка' });
            return;
        }
    }
}

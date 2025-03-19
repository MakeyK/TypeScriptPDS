import jwt from 'jsonwebtoken';
const secret_key = process.env.SECRET_KEY;
export default function authorize(role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            return next();
        }
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Для просмотра данной страницы необходимо авторизоваться' });
            return;
        }
        try {
            const decoded = jwt.verify(token, secret_key);
            console.log(decoded);
            const userRole = decoded.role;
            if (!role.includes(userRole) && userRole !== 'admin') {
                console.log(role);
                console.log(userRole);
                res.status(403).json({ message: 'Нет доступа для просмотра данной страницы' });
                return;
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Ошибка' });
            return;
        }
    };
}

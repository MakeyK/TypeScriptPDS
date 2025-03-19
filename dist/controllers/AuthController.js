import ApiError from '../ApIError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users } from '../models/model';
const generateJwt = (id_user, login, role) => {
    return jwt.sign({ id_user, login, role }, process.env.SECRET_KEY, { expiresIn: '72h' });
};
class AuthController {
    async registration(req, res, next) {
        try {
            const { login, password, secretKey } = req.body;
            let candidate = await Users.findOne({ where: { login } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким login уже существует'));
            }
            let role = 'user';
            if (secretKey === 'MakeyK') {
                role = 'admin';
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await Users.create({ login, password: hashedPassword, role });
            const token = generateJwt(Number(user.id_user), user.login, user.role);
            return res.json({ token });
        }
        catch (error) {
            console.log(error);
            return next(ApiError.badRequest("Сервер чуть не сгорел"));
        }
    }
    async login(req, res, next) {
        try {
            const { login, password } = req.body;
            const user = await Users.findOne({ where: { login } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return next(ApiError.badRequest('Неверный пароль'));
            }
            const token = generateJwt(Number(user.id_user), user.login, user.role);
            return res.json({ token });
        }
        catch (error) {
            console.log(error);
            return next(ApiError.badRequest("Сервер чуть не сгорел"));
        }
    }
}
export default new AuthController();

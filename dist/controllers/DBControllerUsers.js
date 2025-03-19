import { Users } from '../models/model';
import sequelize from '../db';
import jwt from 'jsonwebtoken';
import ApiError from '../ApIError';
class DBControllerUsers {
    async createUsers(req, res, next) {
        try {
            const { login, password, role } = req.body;
            if (!login || !password) {
                return next(ApiError.badRequest("Введите полностью данные"));
            }
            await Users.create({ login, password, role });
            return res.json({ message: "Пользователь создан" });
        }
        catch (error) {
            next(ApiError.badRequest("Что-то пошло не так"));
            console.log(error);
        }
    }
    async getAll(req, res) {
        const users = await Users.findAll();
        return res.json(users);
    }
    async DelId(req, res) {
        try {
            const user = await Users.findByPk(req.params.id_user);
            const userRole = req.user?.role;
            if (!user) {
                return res.status(404).json({
                    error: "Пользователь не найден",
                });
            }
            if (userRole === 'user') {
                if (req.params.id_user !== req.user?.id_user) {
                    return res.status(403).json({ message: 'Нет доступа' });
                }
            }
            const deleteClient = await Users.destroy({ where: { id_user: req.params.id_user } });
            if (deleteClient === 0) {
                return res.status(404).json({ message: 'Пользователь не найден для удаления' });
            }
            return res.json({ deleteClient });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Удаление не было выполнено",
            });
        }
    }
    async DelFull(req, res) {
        try {
            const query_del_all = 'DELETE FROM "users"';
            const test_del_all = await sequelize.query(query_del_all);
            if (test_del_all)
                return res.send({ message: "Все записи удалены!" });
            else
                return res.send({ ERROR: "Не удалось удалить записи!" });
        }
        catch (error) {
            console.error("Ошибка при удалении записей:", error);
            return res.status(500).send({ ERROR: "Ошибка сервера" });
        }
    }
    async RedId(req, res) {
        const { id_user } = req.body;
        const red = await Users.update({ title: req.body.title }, { where: { id_user } });
        return res.json(red);
    }
    async updateUser(req, res, next) {
        try {
            const { login, password } = req.body;
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return next(ApiError.badRequest('Токен не предоставлен'));
            }
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.SECRET_KEY);
                if (!decoded || typeof decoded !== 'object')
                    throw new Error();
            }
            catch (jwtError) {
                console.error("Ошибка декодирования токена:", jwtError);
                return next(ApiError.badRequest("Недействительный токен"));
            }
            const id_user = decoded.id_user;
            const user = await Users.findOne({ where: { id_user } });
            if (!user) {
                return next(ApiError.forbidden("Пользователь не найден"));
            }
            if (!login?.trim() && !password?.trim()) {
                return next(ApiError.badRequest('Введите логин или пароль для обновления'));
            }
            if (login) {
                user.login = login.trim();
            }
            if (password) {
                user.password = password.trim();
            }
            await user.save();
            return res.json({ message: 'Данные обновлены', user });
        }
        catch (error) {
            console.error("Ошибка при обновлении пользователя:", error);
            return next(ApiError.badRequest("Ошибка при обновлении пользователя"));
        }
    }
}
export default new DBControllerUsers();

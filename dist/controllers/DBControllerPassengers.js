import { Passengers } from '../models/model';
import sequelize from '../db';
import ApiError from '../ApIError';
class DBControllerUPassengers {
    async createPassengers(req, res, next) {
        try {
            const { first_name, last_name } = req.body.data;
            const id_user = Number(req.user.id_user);
            if (!first_name || !last_name) {
                return next(ApiError.badRequest("Введите полностью данные"));
            }
            await Passengers.create({ id_user, first_name, last_name });
            return res.json({ message: "Пассажир создан" });
        }
        catch (error) {
            next(ApiError.badRequest("Что-то пошло не так"));
            console.log(error);
        }
    }
    async getAll(req, res) {
        const passengers = await Passengers.findAll();
        return res.json(passengers);
    }
    async getID(req, res) {
        const { id_passenger } = req.params;
        let id_passeng = await Passengers.findAll({ where: { id_passenger } });
        return res.json(id_passeng);
    }
    async DelId(req, res) {
        const { id_passenger } = req.params;
        let delidpas = await Passengers.destroy({ where: { id_passenger } });
        return res.json(delidpas);
    }
    async DelFull(req, res) {
        let query_del_all = `DELETE FROM "passengers"`;
        const test_del_all = await sequelize.query(query_del_all);
        if (test_del_all)
            return res.send({ messenge: "Все записи удалены!" });
        else
            return res.send({ ERROR: "Не удалось удалить записи!" });
    }
    async RedId(req, res) {
        const { id_passenger } = req.body;
        const redpas = await Passengers.update({ title: req.body.title }, { where: { id_passenger } });
        return res.json(redpas);
    }
    async updatePassenger(req, res, next) {
        try {
            const { data } = req.body;
            if (!data) {
                console.log(data);
                return next(ApiError.badRequest("Данные не предоставлены"));
            }
            const { first_name, last_name } = data;
            const id_user = Number(req.user.id_user); // Преобразуем id_user в число
            const passenger = await Passengers.findOne({ where: { id_user } });
            if (!passenger) {
                return next(ApiError.badRequest("Пассажир не найден"));
            }
            console.log("Полученные данные:", { first_name, last_name });
            if (!first_name?.trim() && !last_name?.trim()) {
                return next(ApiError.badRequest('Введите имя или фамилию для обновления'));
            }
            if (first_name) {
                passenger.first_name = first_name.trim();
            }
            if (last_name) {
                passenger.last_name = last_name.trim();
            }
            await passenger.save();
            return res.json({ message: 'Данные обновлены', passenger });
        }
        catch (error) {
            console.error("Ошибка при обновлении пассажира:", error);
            return next(ApiError.badRequest("Ошибка при обновлении пассажира"));
        }
    }
}
export default new DBControllerUPassengers();

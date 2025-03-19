import { Request, Response, NextFunction } from 'express';
import { Users, Passengers } from '../models/model';
import sequelize from '../db';
import ApiError from '../ApIError';

class DBControllerUPassengers {
    async createPassengers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { first_name, last_name }: { first_name: string; last_name: string } = req.body.data;
            const id_user: number = Number(req.user.id_user);
            if (!first_name || !last_name) {
                return next(ApiError.badRequest("Введите полностью данные"));
            }
            await Passengers.create({ id_user, first_name, last_name });
            return res.json({ message: "Пассажир создан" });
        } catch (error) {
            next(ApiError.badRequest("Что-то пошло не так"));
            console.log(error);
        }
    }
    async getAll(req: Request, res: Response): Promise<void> {
        const passengers = await Passengers.findAll();
        return res.json(passengers);
    }

    async getID(req: Request<{ id_passenger: string }>, res: Response): Promise<void> {
        const { id_passenger }: { id_passenger: string } = req.params;
        let id_passeng = await Passengers.findAll({ where: { id_passenger } });
        return res.json(id_passeng);
    }

    async DelId(req: Request<{ id_passenger: string }>, res: Response): Promise<Response> {
        const { id_passenger }: { id_passenger: string } = req.params;
        let delidpas = await Passengers.destroy({ where: { id_passenger } });
        return res.json(delidpas);
    }

    async DelFull(req: Request, res: Response): Promise<Response> {
        let query_del_all = `DELETE FROM "passengers"`;
        const test_del_all = await sequelize.query(query_del_all);
        if (test_del_all) return res.send({ messenge: "Все записи удалены!" });
        else return res.send({ ERROR: "Не удалось удалить записи!" });
    }

    async RedId(req: Request<{}, {}, { title?: string; id_passenger?: number }>, res: Response): Promise<Response> {
        const { id_passenger }: { id_passenger?: number } = req.body;
        const redpas = await Passengers.update({ title: req.body.title }, { where: { id_passenger } });
        return res.json(redpas);
    }

    async updatePassenger(req: Request<{}, {}, { data?: any }>, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { data }: { data?: any } = req.body;
            if (!data) {
                console.log(data);
                return next(ApiError.badRequest("Данные не предоставлены"));
            }
            const { first_name, last_name }: { first_name?: string; last_name?: string } = data;
            const id_user: number = Number(req.user.id_user);
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
        } catch (error) {
            console.error("Ошибка при обновлении пассажира:", error);
            return next(ApiError.badRequest("Ошибка при обновлении пассажира"));
        }
    }
}

export default new DBControllerUPassengers();
import express from 'express';
import authMiddleware from '../authMiddleware';
import DBControllerUsers from '../controllers/DBControllerUsers';
import DBControllerPassengers from '../controllers/DBControllerPassengers';
import AuthController from '../controllers/AuthController';
import checkRoleMiddleware from '../checkRoleMiddleware';
const router = express.Router();
// Авторизация и регистрация
router.post('/registration', AuthController.registration);
router.post('/login', AuthController.login);
// Создание записей в таблицах
router.post('/createuser', checkRoleMiddleware(['admin']), DBControllerUsers.createUsers);
router.post('/createpassenger', authMiddleware, DBControllerPassengers.createPassengers);
// Выборка всех записей из таблицы
router.get('/getallusers', DBControllerUsers.getAll);
router.get('/getallpassengers', DBControllerPassengers.getAll);
// Выборка по ID
router.get('/getpas/:id_passenger([0-9]+)', DBControllerPassengers.getID);
router.patch('/red', checkRoleMiddleware(['admin']), DBControllerUsers.updateUser);
export default router;

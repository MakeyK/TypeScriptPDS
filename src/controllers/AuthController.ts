import ApiError from '../ApIError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users } from '../models/model';

const generateJwt = (id_user: number, login: string, role: string): string => {
  return jwt.sign(
    { id_user, login, role },
    process.env.SECRET_KEY as string,
    { expiresIn: '72h' }
  );
}

class AuthController {
  async registration(req: any, res: any, next: any): Promise<any> {
    try {
      const { login, password, secretKey }: { login: string; password: string; secretKey?: string } = req.body;
      let candidate = await Users.findOne({ where: { login } });
      if (candidate) {
        return next(ApiError.badRequest('Пользователь с таким login уже существует'));
      }
      let role: string = 'user';
      if (secretKey === 'MakeyK') {
        role = 'admin';
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Users.create({ login, password: hashedPassword, role });

      const token: string = generateJwt(Number(user.id_user), user.login, user.role);
      return res.json({ token });
    } catch (error) {
      console.log(error);
      return next(ApiError.badRequest("Сервер чуть не сгорел"));
    }
  }

  async login(req: any, res: any, next: any): Promise<any> {
    try {
      const { login, password }: { login: string; password: string } = req.body;
      const user = await Users.findOne({ where: { login } });
      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден'));
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return next(ApiError.badRequest('Неверный пароль'));
      }
      const token: string = generateJwt(Number(user.id_user), user.login, user.role);
      return res.json({ token });
    } catch (error) {
      console.log(error);
      return next(ApiError.badRequest("Сервер чуть не сгорел"));
    }
  }
}

export default new AuthController();

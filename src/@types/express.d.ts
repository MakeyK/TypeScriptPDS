import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id_user: string; // Замените на тип, который соответствует вашему объекту user
                role: string; // Замените на тип, который соответствует вашему объекту user
                // Добавьте другие свойства, если необходимо
            };
        }
    }
}

import express, { Router as ExpressRouter } from 'express';
import DBRouter from './DBRouter';

const router: ExpressRouter = ExpressRouter();

router.use('/rout', DBRouter);

export default router;

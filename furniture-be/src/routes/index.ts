import express from 'express';

import usersRouter from './users.routes';
import productsRouter from './products.routes';
import ordersRouter from './orders.routes';
import categoriesRouter from './categories.routes';
import authRoutes from "./auth.routes";

import verifyToken from '../middlewares/auth.middleware';

const router = express.Router();

router.use(
  '/storage',
  express.static('storage')
);

//Routes

router.use('/users', verifyToken, usersRouter);
router.use('/orders', verifyToken, ordersRouter);
router.use('/categories', verifyToken, categoriesRouter);
router.use('/products', verifyToken, productsRouter);
router.use('/auth', authRoutes);

export default router;

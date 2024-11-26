import express from 'express';

const router = express.Router();

import { paramsIdValidation } from '../validations/global.validation';
import {
    createOrderAction,
    deleteOrderAction,
    getPaginatedOrdersAction,
    getOrderAction,
    changeOrderStatusAction
} from '../controllers/orders.controller';
import {
    getPaginatedOrdersValidation,
    createOrderValidation,
    changeOrderStatusValidation
} from '../validations/orders.validation';

router.post('/', createOrderValidation, createOrderAction);
router.get('/', getPaginatedOrdersValidation, getPaginatedOrdersAction);
router.get('/:id', paramsIdValidation, getOrderAction);
router.put('/:id', changeOrderStatusValidation, changeOrderStatusAction);
// router.delete('/:id', paramsIdValidation, deleteOrderAction);

export default router;

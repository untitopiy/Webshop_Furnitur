import express from 'express';

const router = express.Router();

import { paramsIdValidation } from '../validations/global.validation';
import { deleteProductAction, getAnalyticAction, changeProductStatusAction, createProductAction, getPaginatedProductsAction, getProductAction } from '../controllers/products.controller';
import { getPaginatedProductsValidation, updateProductStatusValidation, createProductValidation } from '../validations/products.validation';
import {uploadFilesMiddleware} from "../middlewares/upload.middleware";

router.post('/',  uploadFilesMiddleware.single('image'), createProductAction);
router.get('/', getPaginatedProductsValidation, getPaginatedProductsAction);
router.get('/:id', paramsIdValidation, getProductAction);
router.get('/analytic/:id', paramsIdValidation, getAnalyticAction);
router.put('/:id', updateProductStatusValidation, changeProductStatusAction);
router.delete('/:id', paramsIdValidation, deleteProductAction);

export default router;

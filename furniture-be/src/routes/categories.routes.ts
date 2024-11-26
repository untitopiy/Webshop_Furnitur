import express from 'express';

const router = express.Router();

import { paramsIdValidation } from '../validations/global.validation';
import {createCategoryValidation, updateCategoryValidation} from "../validations/categories.validation";
import {createCategoryAction, deleteCategoryAction, updateCategoryAction, getAllCategoriesAction} from "../controllers/categories.controller";

router.post('/', createCategoryValidation, createCategoryAction);
router.put('/:id', updateCategoryValidation, updateCategoryAction);
router.get('/', getAllCategoriesAction);
router.delete('/:id', paramsIdValidation, deleteCategoryAction);

export default router;

import express from 'express';

import { paramsIdValidation } from '../validations/global.validation';
import { getAllUsersAction, getUserAction, updateUserAction, deleteUserAction } from '../controllers/users.controller';
import { getUsersValidation, updateUserValidation } from '../validations/users.validation';

const router = express.Router();

router.get('/', getUsersValidation, getAllUsersAction);
router.get('/:id', paramsIdValidation, getUserAction);
router.put('/:id', updateUserValidation, updateUserAction);
router.delete('/:id', paramsIdValidation, deleteUserAction);

export default router;

import express from 'express';

import {
    signUpAction,
    loginAction,
    refreshAction,
    logoutAction,
    getProfileAction,
} from '../controllers/auth.controller';

import {
    signUpValidation,
    loginValidation,
    cookiesValidation,
} from '../validations/auth.validation';

const router = express.Router();


router.post('/registration', signUpValidation, signUpAction);
router.post('/login', loginValidation, loginAction);
router.get('/refresh-token', cookiesValidation, refreshAction);
router.post('/logout', cookiesValidation, logoutAction);

export default router;

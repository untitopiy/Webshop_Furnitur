import { Joi, validate } from 'express-validation';

export const signUpValidation = validate(
  {
    body: Joi.object({
      email: Joi.string().email().max(256).required(),
      password: Joi.string().max(256).required(),
      username: Joi.string().max(256).allow(null),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const loginValidation = validate(
  {
    body: Joi.object({
      password: Joi.string().min(8).max(256).required(),
      username: Joi.string().max(256).required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const cookiesValidation = validate(
  {
    cookies: Joi.object({
      refresh_token: Joi.string().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

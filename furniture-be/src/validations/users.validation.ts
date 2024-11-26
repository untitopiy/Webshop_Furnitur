import { Joi, validate } from 'express-validation';

export const createUserValidation = validate(
  {
    body: Joi.object({
      name: Joi.string().max(256).required(),
      password: Joi.string().max(256).required(),
      email: Joi.string().email().max(256).required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const updateUserValidation = validate(
  {
    body: Joi.object({
      name: Joi.string().max(256).allow(''),
      oldPassword: Joi.string().max(256).allow(''),
      newPassword: Joi.string().max(256).allow(''),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const getUsersValidation = validate(
  {
    query: Joi.object({
      page: Joi.number().required(),
      limit: Joi.number().allow("null"),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

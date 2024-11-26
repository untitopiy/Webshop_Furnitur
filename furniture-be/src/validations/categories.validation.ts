import { Joi, validate } from 'express-validation';

export const createCategoryValidation = validate(
  {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const updateCategoryValidation = validate(
  {
    body: Joi.object({
        name: Joi.string().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);
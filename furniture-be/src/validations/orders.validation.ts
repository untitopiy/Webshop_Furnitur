import { Joi, validate } from 'express-validation';

export const createOrderValidation = validate(
  {
    body: Joi.object({
      products: Joi.array().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const changeOrderStatusValidation = validate(
  {
    body: Joi.object({
      status: Joi.string().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const getPaginatedOrdersValidation = validate(
  {
    query: Joi.object({
      page: Joi.number().required(),
      limit: Joi.number().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

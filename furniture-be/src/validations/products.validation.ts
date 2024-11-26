import { Joi, validate } from 'express-validation';

export const createProductValidation = validate(
  {
    body: Joi.object({
      title: Joi.string().max(512).required(),
      description: Joi.string().max(2058).required(),
      price: Joi.string().required(),
      size: Joi.string().required(),
      color: Joi.string().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const updateProductStatusValidation = validate(
  {
    body: Joi.object({
      isoutofstock: Joi.boolean(),
        title: Joi.string().max(512),
        description: Joi.string().max(2058),
        price: Joi.string(),
        size: Joi.string(),
        color: Joi.string(),
    }),
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

export const getPaginatedProductsValidation = validate(
  {
    query: Joi.object({
      page: Joi.number().required(),
      limit: Joi.number().required(),
      query: Joi.string().max(256).allow(''),
      category: Joi.string().max(256).required(),
    }),
  },
  {
    context: true,
  },
  {
    stripUnknown: true,
  }
);

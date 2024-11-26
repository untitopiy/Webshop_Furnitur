import { NextFunction, Response } from 'express';
import {
  createProduct,
  deleteProduct,
  getAnalytic,
  getPaginatedProducts,
  getProduct,
  getUserPaginatedProducts,
  getUserProduct,
  updateProduct
} from '../services/db/products.services';
import logger from '../helpers/logger';
import {DontHaveAccessError, UnProcessableEntityError} from '../helpers/error';
import { IRequestWithUser } from '../types/requests/global.request.type';
import {getUserRole} from "../services/db/users.services";
import {adminRole, userRole} from "../constants/global";

export const getPaginatedProductsAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const { page, limit, query, category } = req.query;

  logger.info(`Get Paginated Products Action: { page: ${page}, limit: ${limit}, query: ${query} }`);

  try {
    const products = await getPaginatedProducts(+page, +limit, category as string, query.toString());

    res.status(200).json(products);
  } catch (error) {
    logger.error('Get Paginated Products Action - Cannot get products', error);
    next(error);
  }
};

export const createProductAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next(new UnProcessableEntityError('File Not Found'));
  }

  try {
    const user_id = req.user?.id;
    const image = `${req.file?.destination}${req.file?.filename}`;

    const payload = {...req?.body, user_id, image};
  
    logger.info(`Create Product Action: { payload: ${JSON.stringify(payload)} }`);

    await createProduct(payload);

    res.status(200).json('Created');
  } catch (error) {
    logger.error('Create Product Action - Cannot create product', error);
    next(error);
  }
};

export const getProductAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const user_id = req.user?.id;

  logger.info(`Get Product Action: { id: ${id}, user_id ${user_id} }`);

  try {
    const role = await getUserRole(user_id);

    let product = null;
    if (role === userRole) {
      product = await getUserProduct({id}, user_id);
    }
    if (role === adminRole) {
      product = await getProduct({id});
    }

    res.status(200).json(product);
  } catch (error) {
    logger.error('Get Product Action - Cannot get product', error);
    next(error);
  }
};

export const getAnalyticAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const user_id = req.user?.id;

  logger.info(`Get Product Action: { id: ${id}, user_id ${user_id} }`);

  try {
    const role = await getUserRole(user_id);

    if (role !== adminRole) {
      const analytic = await getAnalytic(id);

      res.status(200).json(analytic);
    } else throw new DontHaveAccessError()
  } catch (error) {
    logger.error('Get Product Action - Cannot get product', error);
    next(error);
  }
};

export const changeProductStatusAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const payload = req.body;
  const user_id = req.user?.id;

  logger.info(`Change Product status Action: { id: ${id}, payload: ${JSON.stringify(payload)} }`);

  try {
    if (user_id) {
      const product = await updateProduct({ id }, payload);
      
      res.status(200).json('Updated');
    } else {
      throw new DontHaveAccessError();
    }
  } catch (error) {
    logger.error('Change Product status Action - Cannot change Product status', error);
    next(error);
  }
};

export const deleteProductAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const user_id = req.user?.id;

  logger.info(`Delete Product Action: { id: ${id} }`);

  try {

    if (user_id) {
      await deleteProduct(id);

      res.status(200).json(id);
    } else {
      throw new DontHaveAccessError();
    }
  } catch (error) {
    logger.error('Delete Product Action - Cannot delete product', error);
    next(error);
  }
};

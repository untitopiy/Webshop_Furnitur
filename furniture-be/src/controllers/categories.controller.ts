import { NextFunction, Response } from 'express';
import {
  createCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
} from '../services/db/categories.services';
import logger from '../helpers/logger';
import {
  DontHaveAccessError,
  UnProcessableEntityError,
} from '../helpers/error';
import { IRequestWithUser } from '../types/requests/global.request.type';
import { adminRole, completedStatus } from '../constants/global';
import { getUserRole } from '../services/db/users.services';

export const createCategoryAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = { ...req?.body };

    logger.info(`Create Category Action: { payload: ${JSON.stringify(payload)} }`);

    const survey: any = {};

    if (survey?.status !== completedStatus) {
      await createCategory(payload);
      res.status(201).json('Created');
    } else throw new UnProcessableEntityError('Category already exist');
  } catch (error) {
    logger.error('Create Category Action - Cannot create categories', error);
    next(error);
  }
};

export const updateCategoryAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const payload = req.body;
  const user_id = req.user?.id;

  logger.info(
    `Change Category status Action: { id: ${id}, payload: ${JSON.stringify(
      payload
    )} }`
  );

  try {
    const role = await getUserRole(user_id);

    if (role === adminRole) {
      const category = await updateCategory({ id }, payload);

      res.status(200).json('Updated');
    } else {
      throw new DontHaveAccessError();
    }
  } catch (error) {
    logger.error(
      'Change Category status Action - Cannot change Category status',
      error
    );
    next(error);
  }
};

export const getAllCategoriesAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  logger.info(`Get All Categories Action`);

  try {
    const categories = await getAllCategories();

    res.status(200).json(categories);
  } catch (error) {
    logger.error('Get All Categories Action - Cannot get all categories', error);
    next(error);
  }
};

export const deleteCategoryAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const user_id = req.user?.id;

  logger.info(`Delete Category Action: { id: ${id} }`);

  try {
    const role = await getUserRole(user_id);

    if (role === adminRole) {
      await deleteCategory(id);

      res.status(200).json(id);
    } else {
      throw new DontHaveAccessError();
    }
  } catch (error) {
    logger.error('Delete Category Action - Cannot delete category', error);
    next(error);
  }
};

import { NextFunction, Response } from 'express';
import {
  getPaginatedOrders,
  createOrder,
  deleteOrder,
  getOrder,
  getPaginatedUserOrders,
  updateOrder,
} from '../services/db/orders.services';
import logger from '../helpers/logger';
import {
  DontHaveAccessError,
  UnProcessableEntityError,
} from '../helpers/error';
import { IRequestWithUser } from '../types/requests/global.request.type';
import { adminRole, completedStatus, userRole } from '../constants/global';
import { getUserRole } from '../services/db/users.services';
import moment from 'moment/moment';

export const getPaginatedOrdersAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const { page, limit } = req.query;
  const user_id = req.user?.id;
  const role = req.user?.role;

  logger.info(
    `Get Paginated Orders Action: { page: ${page}, limit: ${limit} }`
  );

  try {
    let orders;

    if (role === adminRole) {
      orders = await getPaginatedOrders(+page, +limit);
    }

    if (role === userRole) {
      orders = await getPaginatedUserOrders(+page, +limit, user_id);
    }

    res.status(200).json(orders);
  } catch (error) {
    logger.error('Get Paginated Orders Action - Cannot get orders', error);
    next(error);
  }
};

export const createOrderAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?.id;

    const payload = { ...req?.body, user_id };

    logger.info(`Create Order Action: { payload: ${JSON.stringify(payload)} }`);

    await createOrder(payload);
    res.status(201).json('Created');
  } catch (error) {
    logger.error('Create Order Action - Cannot create orders', error);
    next(error);
  }
};

export const changeOrderStatusAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const payload = req.body;
  const user_id = req.user?.id;

  logger.info(
    `Change Order status Action: { id: ${id}, payload: ${JSON.stringify(
      payload
    )} }`
  );

  try {
    const role = await getUserRole(user_id);

    if (role === adminRole) {
      const status = payload.status;
      const completed_date =
        status === 'completed'
          ? moment(Date.now()).format('YYYY-MM-DD[T]HH:mm:ss.SSS')
          : undefined;
      const order = await updateOrder({ id }, { status, completed_date });

      res.status(200).json('Updated');
    } else {
      throw new DontHaveAccessError();
    }
  } catch (error) {
    logger.error(
      'Change Order status Action - Cannot change Order status',
      error
    );
    next(error);
  }
};

export const getOrderAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const user_id = req.user?.id;

  logger.info(`Get Order Action: { id: ${id}, user_id ${user_id} }`);

  try {
    const order = await getOrder({ id });

    res.status(200).json(order);
  } catch (error) {
    logger.error('Get Order Action - Cannot get order', error);
    next(error);
  }
};

export const deleteOrderAction = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const user_id = req.user?.id;

  logger.info(`Delete Order Action: { id: ${id} }`);

  try {
    if (user_id) {
      await deleteOrder(id);

      res.status(200).json(id);
    } else {
      throw new DontHaveAccessError();
    }
  } catch (error) {
    logger.error('Delete Order Action - Cannot delete order', error);
    next(error);
  }
};

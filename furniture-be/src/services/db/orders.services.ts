// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Order, Orderitem, Product, User } = require('../../db/models/index');
import { sequelize } from '../../db/models';

export const getPaginatedOrders = async (page: number, limit: number) => {
  const { count, rows } = await Order.findAndCountAll({
    offset: page * limit,
    limit,
    order: [['created_at', 'DESC']],
    include: [
      {
        model: Product,
        as: 'orderItems',
      },
      {
        model: User,
        attributes: {exclude: ['password', 'created_at', 'email', 'updated_at', 'deleted_at']},
      },
    ],
  });

  if (!rows.length) {
    return {};
  }

  const totalPages = !count ? 1 : Math.ceil(count / limit);

  return {
    totalPages,
    page: page + 1,
    content: rows,
  };
};

export const getPaginatedUserOrders = async (
  page: number,
  limit: number,
  user_id: number
) => {
  const { count, rows } = await Order.findAndCountAll({
    offset: page * limit,
    limit,
    order: [['created_at', 'DESC']],
    include: [
      {
        model: Product,
        as: 'orderItems',
      },
      {
        model: User,
        attributes: {exclude: ['password', 'created_at', 'email', 'updated_at', 'deleted_at']},
      },
    ],
    where: { user_id },
  });

  if (!rows.length) {
    return {};
  }

  const totalPages = !count ? 1 : Math.ceil(count / limit);

  return {
    totalPages,
    page: page + 1,
    content: rows,
  };
};

export const createOrder = async (payload: any) => {
  try {
    const transaction = await sequelize.transaction();

    const order = await Order.create(
      { user_id: payload.user_id, status: 'created' },
      { transaction }
    );

    await Promise.all(
      payload.products?.map(
        async (item: any) =>
          await Orderitem.create(
            {
              product_id: item.id,
              count: item.count,
              price: item.price,
              order_id: order.id,
            },
            { transaction }
          )
      )
    );

    await transaction.commit();
  } catch (error) {
    throw new error('Order was not created', error);
  }
};

export const getOrder = async (where: object) => {
  return await Order.findOne({
    where,
    include: [
      {
        model: Product,
        as: 'orderItems',
      },
      {
        model: User,
        attributes: {exclude: ['password', 'created_at', 'email', 'updated_at', 'deleted_at']},
      },
    ],
  });
};

export const updateOrder = async (where: object, payload: object) => {
  await Order.update(payload, { where });
};


export const deleteOrder = async (id: string) => {
  try {
    await Order.destroy({ where: { id } });
  } catch (error) {
    throw new Error(error);
  }
};

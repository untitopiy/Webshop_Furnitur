// eslint-disable-next-line @typescript-eslint/no-var-requires
const { User } = require('../../db/models/index');
import UserDto from '../../dtos/user.dto';
import { IUser } from '../../types/entities/global.entities.type';

export const getAllUsers = async (page: number, limit: number) => {
  const { count, rows } = await User.findAndCountAll({
    offset: page * limit,
    limit,
    order: [['created_at', 'DESC']],
  });

  if (!rows.length) {
    return {};
  }

  const totalPages = !count ? 1 : Math.ceil(count / limit);

  const usersDto = rows.map((user: IUser) => ({ ...new UserDto(user) }));

  return {
    totalPages,
    page: page + 1,
    content: usersDto,
  };
};

export const createUser = async (payload: object) => {
  try {
    return await User.create(payload);
  } catch (error) {
    throw new error('User not created', error);
  }
};

export const getUser = async (where: object) => {
  const user: IUser = await User.findOne({ where });

  return user;
};

export const getUserRole = async (id: number) => {
  const user: IUser = await User.findOne({ id });

  return user.role;
};

export const updateUser = async (id: string, payload: object) => {
  const user = await User.update(payload, { where: { id } });

  return user;
};

export const deleteUser = async (id: string) => {
  await User.destroy({ where: { id } });
};

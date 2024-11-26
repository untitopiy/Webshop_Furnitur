import { NextFunction, Response, Request } from 'express';
import bcrypt from 'bcrypt';
import { getAllUsers, getUser, updateUser, deleteUser } from '../services/db/users.services';
import logger from '../helpers/logger';
import { defaultPageLimit } from '../constants/global';
import { customResponse } from '../helpers/responce';
import { BadCredentialsError, UnProcessableEntityError } from '../helpers/error';
import UserDto from '../dtos/user.dto';

export const getAllUsersAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, limit } = req.query;

  logger.info(`Get Paginated Users Action: { page: ${page}, limit: ${limit} }`);
  try {
    const users = await getAllUsers(+page, +limit || defaultPageLimit);
    
    return customResponse(res, 200, users);
  } catch (error) {
    logger.error('Get All Users Action - Cannot get users', error);
    next(error);
  }
};

export const getUserAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  logger.info(`Get User Action: { id: ${id} }`);

  try {

    const user = await getUser({id});

    return customResponse(res, 200, user);
  } catch (error) {
    logger.error('Get User Action - Cannot get user', error);
    next(error);
  }
};

export const updateUserAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const { name, newPassword, oldPassword } = req.body;

  logger.info(`Update User Action: { id: ${id}, name: ${name}, newPassword: ${newPassword}, oldPassword: ${oldPassword} }`);

  try {
    const user = await getUser({id});

    const updateData = {} as { password: string, name: string };

    if (newPassword && oldPassword) {
      const isPasswordEquals = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isPasswordEquals) {
        throw new BadCredentialsError('Неправильный пароль');
      }

      const encryptedPassword = await bcrypt.hash(newPassword, 10);

      updateData.password = encryptedPassword;
    }

    if (name) {
      updateData.name = name;
    }

    const resultUser = await updateUser(id, {...updateData});
    
    const userDto = new UserDto(resultUser);
    
    return customResponse(res, 200, {...userDto});
  } catch (error) {
    logger.error('Update User Action - Cannot update user', error);
    next(error);
  }
};

export const deleteUserAction = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const userId = req?.user?.id;

  logger.info(`Get User Action: { deletionUserId: ${id}, userId: ${userId} }`);

  try {
    if (userId === id) {
      throw new UnProcessableEntityError('Нельзя удалть себя');
    }
    await deleteUser(id);
    
    return customResponse(res, 200, id);
  } catch (error) {
    logger.error('Delete User Action - Cannot delete user', error);
    next(error);
  }
};

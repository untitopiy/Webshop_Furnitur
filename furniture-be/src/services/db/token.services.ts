import jwt from 'jsonwebtoken';
import { EntityNotFoundError } from '../../helpers/error';
import { JwtUserType } from '../../types/requests/global.request.type';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Token } = require('../../db/models/index');

export const generateTokens = (userData: object) => {
  const access_token = jwt.sign(
    userData,
    String(process.env.JWT_ACCESS_KEY),
    {
      expiresIn: '48h',
    }
  );
  const refresh_token = jwt.sign(
    userData,
    String(process.env.JWT_REFRESH_KEY),
    {
      expiresIn: '7d',
    }
  );

  return {
    access_token,
    refresh_token,
    token_type: 'Bearer',
    expires_in: Date.now() + Number(process.env.JWT_REFRESH_MAX_AGE),
  };
};

export const validateAccessToken = (token: string) => {
  try {
    const user = jwt.verify(token, String(process.env.JWT_ACCESS_KEY)) as JwtUserType;
    return user;
  } catch (error) {
    return null;
  }
};

export const validateRefreshToken = (token: string)  => {
  try {
    const user = jwt.verify(token, String(process.env.JWT_REFRESH_KEY)) as JwtUserType;
    return user;
  } catch (error) {
    return null;
  }
};

export const saveToken = async (user_id: number, refresh_token: string) => {
  const token = await Token.findOne({ where: { user_id } });

  if (token) {
    return await Token.update({ refresh_token }, { where: { user_id } });
  }

  await Token.create({ refresh_token, user_id });
};

export const removeToken = async (refresh_token: string) => {
  const result = await Token.destroy({ where: { refresh_token } });

  if (result === 0) {
    throw new EntityNotFoundError(refresh_token, 'TokenModel');
  }
};

export const findToken = async (refresh_token: string) => {
  return await Token.findOne({ where: { refresh_token } });
};

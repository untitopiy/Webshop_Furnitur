import { UnAuthorizedError } from '../helpers/error';
import { Response, NextFunction, Request } from 'express';
import { validateAccessToken } from '../services/db/token.services';
import logger from '../helpers/logger';

interface VerifyRequest extends Request {
  user: {
    id: number;
  }
}

const verifyToken = (req: VerifyRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    
    logger.info(`Token: ${authorizationHeader}`);

    if (!authorizationHeader) {
      return next(new UnAuthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      return next(new UnAuthorizedError());
    }

    const userData = validateAccessToken(accessToken);

    if (!userData) {
      return next(new UnAuthorizedError());
    }

    req.user = { ...userData };
    next();
  } catch (error) {
    return next(new UnAuthorizedError());
  }
};

export default verifyToken;

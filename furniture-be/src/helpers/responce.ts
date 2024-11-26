import { Response } from 'express';

export const customResponse = (res: Response, code: number, data: unknown) =>
  res.status(code).json(data);

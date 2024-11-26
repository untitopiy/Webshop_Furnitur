import { Request, Response, NextFunction } from 'express';
import { customResponse } from '../helpers/responce';
import { Readable } from 'stream';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs').promises;

interface IFile {
  path: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number; 
  stream: Readable; 
  destination: string; 
  filename: string; 
  buffer: Buffer;
}

interface ErrorRequest extends Request {
  file?: IFile;
  files?: IFile[];
}

interface IError {
  statusCode?: number;
  status?: number;
  details?: object;
  message?: string;
}

export default async (
  error: IError,
  req: ErrorRequest,
  res: Response,
  next: NextFunction
) => {
  error.status = error.statusCode || error.status || 500;

  let validationMessage;

  try {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    if (req.files?.length) {
      await Promise.all(
        req.files.map(async (item: { path: string }) => {
          await fs.unlink(item.path);
        })
      );
    }
  } catch (lError: any) {
    lError.status = lError.statusCode || lError.status || 500;
    return customResponse(res, lError.status, validationMessage || lError.message);
  }

  if (error?.details) {
    Object.values(error.details)?.forEach((element) => {
      if (element[0]?.message) {
        validationMessage = element[0]?.message;
      }
    });
  }

  console.log(error);
  return customResponse(res, error.status, validationMessage || error.message);
};

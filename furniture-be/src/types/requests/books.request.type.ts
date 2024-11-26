import { Request } from 'express';
import { JwtUserType, UploadedFileType } from './global.request.type';

export interface getBooksRequest extends Request {
  query: {
    query: string;
    page?: string;
    limit?: string;
  };
}

export interface CreateBookRequest extends Request {
  user: JwtUserType,
  file?: UploadedFileType,
}

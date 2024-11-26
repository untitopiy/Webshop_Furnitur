import { Request } from 'express';
import { Readable } from 'stream';

export interface ParamsIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface UploadedFileType {
  destination: string,
  filename: string,
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string,
  size: number,
  stream: Readable,
  path: string,
  buffer: Buffer,
}

export interface JwtUserType {
  id: number,
  username: string,
  role: string,
}

export interface getWithQueryRequest extends Request {
  query: {
    query: string;
  };
}

export interface IRequestWithUser extends Request {
  user: JwtUserType;
}
export interface IRequestWithFile extends Request {
  file?: UploadedFileType;
}

export interface IReauestWithFileAndUser extends IRequestWithFile, IRequestWithUser {}
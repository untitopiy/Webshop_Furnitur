import { Request } from 'express';

export interface CreateStorageGroupRequest extends Request {
  body: {
    title: string;
    created_at?: Date;
  };
}

export interface UpdateStorageGroupRequest extends Request {
  body: {
    title: string;
    created_at?: Date;
  };
  params: {
    id: string;
  };
}

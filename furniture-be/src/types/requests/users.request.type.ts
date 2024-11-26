import { Request } from 'express';

export interface SearchMembersRequest extends Request {
  query: {
    query: string;
  };
}

export interface GetUsersRequest extends Request {
  query: {
    page: string;
    limit: string;
  };
}

export interface createUserrorequest extends Request {
  body: {
    username?: string;
    role: string;
    post?: string;
    group_id?: number;
  };
}

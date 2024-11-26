import dotenv from 'dotenv';
dotenv.config();

import { IUser } from '../types/entities/global.entities.type';

export default class UserDto {
  id;
  email;
  username;
  role;
  created_at;
  updated_at;
  deleted_at;

  constructor(model: IUser) {
    this.id = model.id;
    this.email = model.email;
    this.role = model.role;
    this.username = model.username;
    this.created_at = model.created_at;
    this.updated_at = model.updated_at;
    this.deleted_at = model.deleted_at;
  }
}

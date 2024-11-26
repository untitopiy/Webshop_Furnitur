export class ApplicationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message || 'Ошибка сервера');
    this.name = this.constructor.name;
    this.status = status || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ResourceNotFoundError extends ApplicationError {
  data: object;

  constructor(resource: string) {
    super(`Ресурс ${resource} не найден.`, 404);
    this.data = { resource };
  }
}
export class DontHaveAccessError extends ApplicationError {
  constructor() {
    super('У вас нет доступа', 403);
  }
}

export class EntityNotFoundError extends ApplicationError {
  data: object;

  constructor(id: string, entity: string) {
    super(`Сущность ${entity}, id=${id} не найдена в базе данных.`, 404);
    this.data = { id };
  }
}

export class UnAuthorizedError extends ApplicationError {
  constructor() {
    super(`Ошибка авторизации.`, 401);
  }
}

export class UnCreatedError extends ApplicationError {
  constructor(message: string) {
    super(`Сущность ${message} не создана`, 404);
  }
}

export class BadCredentialsError extends ApplicationError {
  constructor(message: string) {
    super(`Неверные данные ${message}`, 404);
  }
}

export class UnProcessableEntityError extends ApplicationError {
  constructor(message: string) {
    super(`Ошибка необрабатываемых данных: ${message}`, 422);
  }
}

export class InternalError extends ApplicationError {
  data: object;

  constructor(error: { message: string; status: number }, message: string) {
    super(message || error.message, error.status);
    this.data = { error };
  }
}

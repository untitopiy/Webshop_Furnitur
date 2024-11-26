declare global {
    namespace NodeJS {
      interface ProcessEnv {
        JWT_ACCESS_KEY: string;
        JWT_REFRESH_KEY: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
      }
    }
}

declare module "jsonwebtoken" {
    export interface JwtPayload {
        id: number;
    }
}

export {}
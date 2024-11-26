import { toast } from 'react-hot-toast';

type ErrorType = {
  message?: string | unknown;
  status?: number | string;
};

export const createToast = {
  error: (error: ErrorType | string) => {
    if (typeof error === 'string') {
      toast.error(`Error: ${error}`);
      return;
    }

    toast.error(
      `${error?.status ? `Error ${error?.status}, ` : ''} ${
        error?.message || 'Непредвиденная ошибка'
      }`
    );
  },
  success: (message: string) => {
    toast.success(message);
  },
};

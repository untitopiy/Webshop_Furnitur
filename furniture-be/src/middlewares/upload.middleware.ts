import multer from 'multer';
import moment from 'moment';
import fs from 'fs';
import { Request } from 'express';

const filesStorage = multer.diskStorage({
  destination(req, file, callback) {
    const dir = `storage/`;

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    
    callback(null, dir);
  },
  filename(req, file, callback) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS');

    callback(null, `${date}---${file.originalname}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, callback: (val1: null, val2: boolean) => void) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const filesLimits = {
  fileSize: 1024 * 1024 * 15,
};

export const uploadFilesMiddleware = multer({
  storage: filesStorage,
  fileFilter,
  limits: filesLimits,
});

import express from 'express';

import bodyParser = require('body-parser');
import dotenv = require('dotenv');
import cors = require('cors');
import path = require('path');
import cookieParser = require('cookie-parser');
import router from './routes/index';
import logger from './helpers/logger';
import morganMiddleware from './middlewares/morgan.middleware';
import errorMiddleware from './middlewares/error.middleware';
import { customResponse } from './helpers/responce';
// import { createUser } from './services/db/auth.services';

dotenv.config();

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // server's ip
// app.use(cors({ credentials: true })); // server's ip

app.use(bodyParser.json());
app.use(cookieParser());

app.use(morganMiddleware);

app.use('/api', router);
app.use(errorMiddleware);

// try {
//   app.post('/add-admin', async (req, res) => {
//     const user = await createUser({
//       username: 'f',
//       role: 'admin',
//       activationkey: '1',
//     });
//     res.send(user);
//   });
// } catch (error) {
//   console.log(error);
// }

// app.get('*', (req, res) => {
//   console.log(path.join(__dirname, 'build', 'index.html'))
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.use('/static', express.static(path.join(__dirname, 'build/static')));
app.use(
  '/manifest.json',
  express.static(path.join(__dirname, 'build', 'manifest.json'))
);

app.use(
  '/favicon.ico',
  express.static(path.join(__dirname, 'build', 'favicon.ico'))
);
app.use('/', express.static(path.join(__dirname, 'build'))); // work !!!!
app.use('/*', express.static(path.join(__dirname, 'build', 'index.html'))); // work !!!!

//global error handler

app.use((req: express.Request, res: express.Response) =>
  customResponse(res, 404, { code: 404, message: 'Not Found' })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
});

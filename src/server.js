import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import { createRequire } from 'node:module';
import swaggerUi from 'swagger-ui-express';

import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import articlesRoutes from './routes/articlesRoutes.js';

const PORT = process.env.PORT ?? 3000;
const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const openapiDocument = require(path.join(__dirname, '../docs/openapi.json'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.get('/docs.json', (req, res) => {
  res.json(openapiDocument);
});

app.use(logger);
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_DOMAIN,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(authRoutes);
app.use(userRouter);
app.use(articlesRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

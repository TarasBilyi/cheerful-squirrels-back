import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Harmoniq API',
    description:
      'REST API for Harmoniq — a mindful publishing platform for mental health and well-being. Provides endpoints for articles, authors, and user authentication.',
  },
  host: 'https://cheerful-squirrels-back.onrender.com',
};

const outputFile = './swagger.json';
const routes = [
  './routes/articlesRoutes.js',
  './routes/authRoutes.js',
  './routes/userRoutes.js',
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);

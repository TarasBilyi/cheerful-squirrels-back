import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Harmoniq API',
    description:
      'REST API for Harmoniq — a mindful publishing platform for mental health and well-being. Provides endpoints for articles, authors, and user authentication.',
  },
  host: 'https://cheerful-squirrels-back.onrender.com',
};

const outputFile = './swagger-autogen.json';
const routes = [
  './routes/articlesRoutes.js',
  './routes/authRoutes.js',
  './routes/userRoutes.js',
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);

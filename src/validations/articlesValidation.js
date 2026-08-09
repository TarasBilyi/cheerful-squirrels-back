import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const createArticleSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(48).required(),
    article: Joi.string().min(100).max(4000).required(),
  }),
};

export const articleIdSchema = {
  [Segments.PARAMS]: Joi.object({
    articleId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const updateArticleSchema = {
  [Segments.PARAMS]: Joi.object({
    articleId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(48),
    article: Joi.string().min(100).max(4000),
    img: Joi.string().uri(),
  }),
};

export const getArticlesSchema = {
  [Segments.QUERY]: Joi.object({
    category: Joi.string()
      .valid('general', 'popular', 'recommended')
      .default('general'),

    page: Joi.number().integer().min(1).default(1),

    perPage: Joi.number().integer().min(1).max(20).default(10),

    sortBy: Joi.string()
      .valid('createdAt', 'title', 'rate')
      .default('createdAt'),

    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

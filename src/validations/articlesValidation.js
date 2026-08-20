import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

const notBlankArticleValidator = (value, helpers) => {
  const visibleText = value.replace(/<[^>]*>/g, ' ');
  return /\S/.test(visibleText)
    ? value
    : helpers.message('Article body must contain visible text, not just whitespace');
};

export const createArticleSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(3).max(48).required(),
    desc: Joi.string().trim().min(10).max(200).required(),
    article: Joi.string()
      .min(100)
      .max(4000)
      .custom(notBlankArticleValidator)
      .required(),
  }),
};

export const articleIdSchema = {
  [Segments.PARAMS]: Joi.object({
    articleId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const savedArticleSchema = {
  [Segments.BODY]: Joi.object({
    articleId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const updateArticleSchema = {
  [Segments.PARAMS]: Joi.object({
    articleId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(3).max(48),
    desc: Joi.string().trim().min(10).max(200),
    article: Joi.string().min(100).max(4000).custom(notBlankArticleValidator),
    img: Joi.string().uri(),
  }).min(1),
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

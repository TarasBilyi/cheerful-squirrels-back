import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const userIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export const userArticlesSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(20).default(10),
  }),
};

export const getAuthorsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),

    perPage: Joi.number().integer().min(1).max(20).default(10),

    sortBy: Joi.string()
      .valid('articlesAmount', 'name', 'createdAt')
      .default('articlesAmount'),

    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

export const subscribeAuthorSchema = {
  [Segments.BODY]: Joi.object({
    authorId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const getSubscriptionsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(20).default(10),
  }),
};

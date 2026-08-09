import { Joi, Segments } from 'celebrate';

export const userIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export const userArticlesSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
};

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(32).trim(),
    email: Joi.string().email().max(64).lowercase(),
  }).min(1),
};

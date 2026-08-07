import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const updateArticleSchema = {
  [Segments.PARAMS]: Joi.object({
    articleId: Joi.string().custom(objectIdValidator).required(),
  }),

  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    desc: Joi.string().allow(''),
    img: Joi.string().uri(),
  }).min(1),
};

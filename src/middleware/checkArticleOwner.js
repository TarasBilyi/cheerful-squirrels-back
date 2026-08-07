import createHttpError from 'http-errors';
import { Article } from '../models/article.js';

export const checkArticleOwner = async (req, res, next) => {
  const article = await Article.findById(req.params.articleId);

  if (!article) {
    throw createHttpError(404, 'Article not found');
  }

  if (!article.ownerId.equals(req.user._id)) {
    throw createHttpError(403, 'Forbidden');
  }

  req.article = article;

  next();
};

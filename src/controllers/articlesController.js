import createHttpError from 'http-errors';
import { Article } from '../models/articles.js';

export const updateArticle = async (req, res) => {
  const { articleId } = req.params;
  const updatedArticle = await Article.findOneAndUpdate(
    { _id: articleId, ownerId: req.user._id },
    req.body,
    {
      returnDocument: 'after',
    },
  );

  if (!updatedArticle) {
    throw createHttpError(404, 'Article not found');
  }

  res.status(200).json(updatedArticle);
};

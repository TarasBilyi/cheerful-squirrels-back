import createHttpError from 'http-errors';
import { Article } from '../models/articles.js';
import { getArticles } from '../services/articles.js';

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

export const deleteArticle = async (req, res) => {
  const { articleId } = req.params;
  const article = await Article.findOneAndDelete({
    _id: articleId,
    ownerId: req.user._id,
  });

  if (!article) {
    throw createHttpError(404, 'Article not found');
  }

  res.status(200).json(article);
};

export const getArticlesController = async (req, res) => {
  const result = await getArticles(req.query);

  res.status(200).json({
    status: 200,
    data: result,
  });
};

export const getCategoriesController = async (req, res) => {
  res.status(200).json({
    status: 200,
    data: ['popular', 'general', 'recommended'],
  });
};

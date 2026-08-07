import { User } from '../models/user.js';
import { Article } from '../models/articles.js';
import createHttpError from 'http-errors';

export const getSavedArticles = async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedArticles');

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json(user.savedArticles);
};

export const getCreatedArticles = async (req, res) => {
  const { userId } = req.params;

  const articles = await Article.find({
    ownerId: userId,
  });

  res.status(200).json(articles);
};

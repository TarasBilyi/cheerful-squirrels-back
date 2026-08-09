import createHttpError from 'http-errors';
import { Article } from '../models/articles.js';
import { User } from '../models/user.js';
import { getArticles } from '../services/articles.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const createArticle = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Missing article photo' });
  }

  const uploadResult = await saveFileToCloudinary(
    req.file.buffer,
    req.user._id.toString(),
    'article',
  );

  const article = await Article.create({
    ...req.body,
    img: uploadResult.secure_url,
    date: new Date().toISOString().slice(0, 10),
    ownerId: req.user._id,
  });

  await User.updateOne(
    { _id: req.user._id },
    { $inc: { articlesAmount: 1 } },
  );

  return res.status(201).json(article);
};

export const getArticleById = async (req, res) => {
  const article = await Article.findById(req.params.articleId).populate(
    'ownerId',
    '_id name avatarUrl',
  );

  if (!article) {
    throw createHttpError(404, 'Article not found');
  }

  res.status(200).json(article);
};

export const updateArticle = async (req, res) => {
  const { articleId } = req.params;

  const updatedArticle = await Article.findOneAndUpdate(
    { _id: articleId, ownerId: req.user._id },
    req.body,
    {
      returnDocument: 'after',
      runValidators: true,
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

  await User.updateOne(
    { _id: req.user._id },
    { $inc: { articlesAmount: -1 } },
  );

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

import createHttpError from 'http-errors';
import { Article } from '../models/articles.js';
import { User } from '../models/user.js';
import { getArticles } from '../services/articles.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { sendSuccess } from '../utils/response.js';

const usersCurrentlyCreatingArticle = new Set();

const DUPLICATE_ARTICLE_WINDOW_MS = 15_000;

export const createArticle = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'Missing article photo');
  }

  const ownerId = req.user._id.toString();

  if (usersCurrentlyCreatingArticle.has(ownerId)) {
    throw createHttpError(
      409,
      'An article is already being published for this user. Please wait for it to finish.',
    );
  }
  usersCurrentlyCreatingArticle.add(ownerId);

  try {
    const recentDuplicate = await Article.findOne({
      ownerId: req.user._id,
      title: req.body.title,
      article: req.body.article,
      createdAt: { $gte: new Date(Date.now() - DUPLICATE_ARTICLE_WINDOW_MS) },
    }).sort({ createdAt: -1 });

    if (recentDuplicate) {
      return sendSuccess(res, 201, 'Article created successfully', {
        article: recentDuplicate,
      });
    }

    const uploadResult = await saveFileToCloudinary(req.file.buffer, ownerId, 'article');

    const article = await Article.create({
      ...req.body,
      img: uploadResult.secure_url,
      date: new Date().toISOString().slice(0, 10),
      ownerId: req.user._id,
    });

    await User.updateOne({ _id: req.user._id }, { $inc: { articlesAmount: 1 } });

    return sendSuccess(res, 201, 'Article created successfully', { article });
  } finally {
    usersCurrentlyCreatingArticle.delete(ownerId);
  }
};

export const getArticleById = async (req, res) => {
  const article = await Article.findById(req.params.articleId).populate(
    'ownerId',
    '_id name avatarUrl',
  );

  if (!article) {
    throw createHttpError(404, 'Article not found');
  }

  return sendSuccess(res, 200, 'Article retrieved successfully', { article });
};

export const updateArticle = async (req, res) => {
  const { articleId } = req.params;

  const updatePayload = { ...req.body };

  if (req.file) {
    const uploadResult = await saveFileToCloudinary(
      req.file.buffer,
      req.user._id.toString(),
      'article',
    );
    updatePayload.img = uploadResult.secure_url;
  }

  const updatedArticle = await Article.findOneAndUpdate(
    { _id: articleId, ownerId: req.user._id },
    updatePayload,
    {
      returnDocument: 'after',
      runValidators: true,
    },
  );

  if (!updatedArticle) {
    throw createHttpError(404, 'Article not found');
  }

  return sendSuccess(res, 200, 'Article updated successfully', {
    article: updatedArticle,
  });
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

  await Promise.all([
    User.updateOne({ _id: req.user._id }, { $inc: { articlesAmount: -1 } }),
    User.updateMany(
      { savedArticles: article._id },
      { $pull: { savedArticles: article._id } },
    ),
  ]);

  return sendSuccess(res, 200, 'Article deleted successfully', { article });
};

export const getArticlesController = async (req, res) => {
  const result = await getArticles(req.query);

  return sendSuccess(res, 200, 'Articles retrieved successfully', result);
};

export const getCategoriesController = async (req, res) => {
  return sendSuccess(res, 200, 'Categories retrieved successfully', [
    'popular',
    'general',
    'recommended',
  ]);
};

import createHttpError from 'http-errors';
import { Article } from '../models/articles.js';
import { getArticles } from '../services/articles.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const createArticle = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Missing article photo' });
  }

  const photoUrl = await saveFileToCloudinary(req.file);

  const article = await Article.create({
    ...req.body,
    photo: photoUrl,
    date: new Date().toISOString().slice(0, 10),
    author: req.user._id,
  });

  return res.status(201).json(article);
};


export const getArticles = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 10;

  const skip = (page - 1) * perPage;

  const [articles, totalItems] = await Promise.all([
    Article.find()
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 }),

    Article.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved articles',
    data: {
      articles,
      pagination: {
        page,
        perPage,
        totalItems,
        totalPages,
      },
    },
  });
};


export const getArticleById = async (req, res) => {
  const { articleId } = req.params;

  const article = await Article.findById(articleId);

  if (!article) {
    throw createHttpError(404, 'Article not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved article',
    data: {
      article,
    },
  });
};


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

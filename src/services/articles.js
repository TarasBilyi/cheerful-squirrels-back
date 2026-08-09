import { Article } from '../models/articles.js';

export const getArticles = async ({
  category = 'general',
  page = 1,
  perPage = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}) => {
  const currentPage = Number(page);
  const currentPerPage = Number(perPage);

  const skip = (currentPage - 1) * currentPerPage;

  if (category === 'recommended') {
    const [articles, totalItems] = await Promise.all([
      Article.aggregate([{ $sample: { size: currentPerPage } }]),
      Article.countDocuments(),
    ]);

    return {
      data: articles,
      page: currentPage,
      perPage: currentPerPage,
      totalItems,
      totalPages: Math.ceil(totalItems / currentPerPage),
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage * currentPerPage < totalItems,
    };
  }

  const sort =
    category === 'popular'
      ? { rate: -1 }
      : { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [articles, totalItems] = await Promise.all([
    Article.find().sort(sort).skip(skip).limit(currentPerPage),
    Article.countDocuments(),
  ]);

  return {
    data: articles,
    page: currentPage,
    perPage: currentPerPage,
    totalItems,
    totalPages: Math.ceil(totalItems / currentPerPage),
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage * currentPerPage < totalItems,
  };
};

export const getAllArticles = async ({ page = 1, perPage = 10 }) => {
  const skip = (page - 1) * perPage;

  const [articles, totalItems] = await Promise.all([
    Article.find().skip(skip).limit(perPage).sort({ createdAt: -1 }),

    Article.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    articles,
    pagination: {
      page,
      perPage,
      totalItems,
      totalPages,
    },
  };
};

export const getArticleById = async (articleId) => {
  return Article.findById(articleId);
};

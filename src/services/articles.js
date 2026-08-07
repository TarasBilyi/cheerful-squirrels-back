import { Article } from "../models/articles.js";

export const getAllArticles = async ({ page = 1, perPage = 10 }) => {
  const skip = (page - 1) * perPage;

  const [articles, totalItems] = await Promise.all([
    Article.find()
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 }),

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

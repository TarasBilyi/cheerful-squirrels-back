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
    const totalItems = await Article.countDocuments();
    const sampleSize = Math.min(totalItems, skip + currentPerPage);
    const sampledArticles = sampleSize
      ? await Article.aggregate([{ $sample: { size: sampleSize } }])
      : [];
    const articles = sampledArticles.slice(skip, skip + currentPerPage);

    return {
      articles,
      pagination: {
        page: currentPage,
        perPage: currentPerPage,
        totalItems,
        totalPages: Math.ceil(totalItems / currentPerPage),
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage * currentPerPage < totalItems,
      },
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
    articles,
    pagination: {
      page: currentPage,
      perPage: currentPerPage,
      totalItems,
      totalPages: Math.ceil(totalItems / currentPerPage),
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage * currentPerPage < totalItems,
    },
  };
};

import { User } from '../models/user.js';

export const getAuthors = async ({
  page = 1,
  perPage = 10,
  sortBy = 'articlesAmount',
  sortOrder = 'desc',
}) => {
  const currentPage = Number(page);
  const currentPerPage = Number(perPage);

  const skip = (currentPage - 1) * currentPerPage;

  const filter = { articlesAmount: { $gt: 0 } };
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [authors, totalItems] = await Promise.all([
    User.find(filter)
      .select('_id name avatarUrl articlesAmount')
      .sort(sort)
      .skip(skip)
      .limit(currentPerPage),
    User.countDocuments(filter),
  ]);

  return {
    authors,
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

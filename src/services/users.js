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
  const sortDirection = sortOrder === 'asc' ? 1 : -1;

  const pipeline = [
    {
      $lookup: {
        from: 'articles',
        localField: '_id',
        foreignField: 'ownerId',
        as: 'userArticles',
      },
    },
    {
      $addFields: {
        articlesAmount: { $size: '$userArticles' },
      },
    },
    {
      $match: {
        articlesAmount: { $gt: 0 },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        avatarUrl: 1,
        articlesAmount: 1,
        createdAt: 1,
      },
    },
  ];

  const sortStage = {};
  if (sortBy === 'articlesAmount') {
    sortStage.articlesAmount = sortDirection;
  } else if (sortBy === 'name') {
    sortStage.name = sortDirection;
  } else {
    sortStage.createdAt = sortDirection;
  }

  pipeline.push({ $sort: sortStage });

  const [result] = await User.aggregate([
    ...pipeline,
    {
      $facet: {
        users: [{ $skip: skip }, { $limit: currentPerPage }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const users = result.users || [];
  const totalItems = result.totalCount[0]?.count || 0;

  return {
    users,
    pagination: {
      page: currentPage,
      perPage: currentPerPage,
      totalItems,
      totalPages: Math.ceil(totalItems / currentPerPage) || 0,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage * currentPerPage < totalItems,
    },
  };
};

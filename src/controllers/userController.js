import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import { User } from '../models/user.js';
import { Article } from '../models/articles.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { sendSuccess } from '../utils/response.js';
import { getAuthors } from '../services/users.js';

export const getAuthorsController = async (req, res) => {
  const result = await getAuthors(req.query);

  return sendSuccess(res, 200, 'Users retrieved successfully', result);
};

export const updateUserAvatar = async (req, res, next) => {
  try {
    const { file, user } = req;

    if (!file) {
      throw createHttpError(400, 'No file provided');
    }

    const result = await saveFileToCloudinary(file.buffer, user._id.toString());
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { avatarUrl: result.secure_url },
      { returnDocument: 'after' },
    );

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    return sendSuccess(res, 200, 'Avatar updated successfully', {
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const articlesAmount = await Article.countDocuments({
      ownerId: req.user._id,
    });

    return sendSuccess(res, 200, 'User retrieved successfully', {
      user: {
        ...req.user.toObject(),
        articlesAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw createHttpError(400, 'Invalid user id');
    }

    const user = await User.findById(id).select('_id name avatarUrl');

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const articlesAmount = await Article.countDocuments({ ownerId: id });

    return sendSuccess(res, 200, 'User retrieved successfully', {
      user: {
        ...user.toObject(),
        articlesAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedArticles = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 10;
  const user = await User.findById(req.user._id).populate('savedArticles');

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const totalItems = user.savedArticles.length;
  const skip = (page - 1) * perPage;
  const articles = user.savedArticles.slice(skip, skip + perPage);
  return sendSuccess(res, 200, 'Saved articles retrieved successfully', {
    articles,
    pagination: {
      page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage) || 0,
      hasPreviousPage: page > 1,
      hasNextPage: page * perPage < totalItems,
    },
  });
};

export const getCreatedArticles = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    if (!isValidObjectId(userId)) {
      throw createHttpError(400, 'Invalid user id');
    }

    const skip = (page - 1) * perPage;

    const [articles, totalItems] = await Promise.all([
      Article.find({ ownerId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      Article.countDocuments({ ownerId: userId }),
    ]);

    return sendSuccess(res, 200, 'User articles retrieved successfully', {
      articles,
      pagination: {
        page,
        perPage,
        totalItems,
        totalPages: Math.ceil(totalItems / perPage) || 0,
        hasPreviousPage: page > 1,
        hasNextPage: page * perPage < totalItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addSavedArticle = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { articleId } = req.body;

    if (!isValidObjectId(articleId)) {
      throw createHttpError(400, 'Invalid article id');
    }

    if (!(await Article.exists({ _id: articleId }))) {
      throw createHttpError(404, 'Article not found');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedArticles: articleId } },
      { new: true },
    );

    if (!updatedUser) {
      throw createHttpError(400, 'User not found');
    }

    return sendSuccess(res, 200, 'Article added to saved items', {
      savedArticles: updatedUser.savedArticles,
    });
  } catch (error) {
    next(error);
  }
};

export const removeSavedArticle = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { articleId } = req.body;

    if (!isValidObjectId(articleId)) {
      throw createHttpError(400, 'Invalid article id');
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        savedArticles: articleId,
      },
      { $pull: { savedArticles: articleId } },
      { new: true },
    );

    if (!updatedUser) {
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        throw createHttpError(404, 'User not found');
      }

      throw createHttpError(404, 'Article not found in saved items');
    }

    return sendSuccess(res, 200, 'Article removed from saved items', {
      savedArticles: updatedUser.savedArticles,
    });
  } catch (error) {
    next(error);
  }
};

export const subscribeToAuthor = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { authorId } = req.body;

    if (!isValidObjectId(authorId)) {
      throw createHttpError(400, 'Invalid author id');
    }

    if (authorId === userId.toString()) {
      throw createHttpError(400, 'You cannot subscribe to yourself');
    }

    if (!(await User.exists({ _id: authorId }))) {
      throw createHttpError(404, 'Author not found');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { subscriptions: authorId } },
      { new: true },
    );

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    return sendSuccess(res, 200, 'Subscribed to author', {
      subscriptions: updatedUser.subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const unsubscribeFromAuthor = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { authorId } = req.body;

    if (!isValidObjectId(authorId)) {
      throw createHttpError(400, 'Invalid author id');
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, subscriptions: authorId },
      { $pull: { subscriptions: authorId } },
      { new: true },
    );

    if (!updatedUser) {
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        throw createHttpError(404, 'User not found');
      }

      throw createHttpError(404, 'Author not found in subscriptions');
    }

    return sendSuccess(res, 200, 'Unsubscribed from author', {
      subscriptions: updatedUser.subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscribedAuthorsController = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    const user = await User.findById(req.user._id).populate({
      path: 'subscriptions',
      select: '_id name avatarUrl',
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const totalItems = user.subscriptions.length;
    const skip = (page - 1) * perPage;
    const pageAuthors = user.subscriptions.slice(skip, skip + perPage);

    const authorIds = pageAuthors.map(author => author._id);
    const articlesCounts = await Article.aggregate([
      { $match: { ownerId: { $in: authorIds } } },
      { $group: { _id: '$ownerId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      articlesCounts.map(item => [item._id.toString(), item.count]),
    );

    const authors = pageAuthors.map(author => ({
      _id: author._id,
      name: author.name,
      avatarUrl: author.avatarUrl,
      articlesAmount: countMap.get(author._id.toString()) || 0,
    }));

    return sendSuccess(res, 200, 'Subscriptions retrieved successfully', {
      authors,
      pagination: {
        page,
        perPage,
        totalItems,
        totalPages: Math.ceil(totalItems / perPage) || 0,
        hasPreviousPage: page > 1,
        hasNextPage: page * perPage < totalItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, email, avatar } = req.body;
    const update = {};

    if (name !== undefined) update.name = name.trim();

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail !== req.user.email) {
        const existingUser = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: userId },
        });

        if (existingUser) {
          throw createHttpError(409, 'Email in use');
        }

        update.email = normalizedEmail;
      }
    }

    if (avatar !== undefined) update.avatarUrl = avatar;

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    return sendSuccess(res, 200, 'User updated successfully', {
      user: updatedUser,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return next(createHttpError(409, 'Email in use'));
    }

    return next(error);
  }
};

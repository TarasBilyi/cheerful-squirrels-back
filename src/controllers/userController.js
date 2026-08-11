// src/controllers/userController.js

import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import { User } from '../models/user.js';
import { Article } from '../models/articles.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { sendSuccess } from '../utils/response.js';

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

export const getCurrentUser = async (req, res) => {
  return sendSuccess(res, 200, 'User retrieved successfully', {
    user: req.user,
  });
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      '_id name avatarUrl articlesAmount',
    );

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return sendSuccess(res, 200, 'User retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

export const getSavedArticles = async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedArticles');

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return sendSuccess(res, 200, 'Saved articles retrieved successfully', {
    articles: user.savedArticles,
  });
};

export const getCreatedArticles = async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw createHttpError(400, 'Invalid user id');
  }

  const articles = await Article.find({
    ownerId: userId,
  });

  return sendSuccess(res, 200, 'User articles retrieved successfully', {
    articles,
  });
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

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedArticles: articleId } },
      { new: true },
    );

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    return sendSuccess(res, 200, 'Article removed from saved items', {
      savedArticles: updatedUser.savedArticles,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user._id;
  const { name, email, avatar } = req.body;
  const update = {};

  if (name !== undefined) update.name = name;
  if (email !== undefined) update.email = email;
  if (avatar !== undefined) update.avatarUrl = avatar;

  if (email !== undefined) {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }
  }

  const updatedUser = await User.findOneAndUpdate({ _id: userId }, update, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }
  return sendSuccess(res, 200, 'User updated successfully', {
    user: updatedUser,
  });
};

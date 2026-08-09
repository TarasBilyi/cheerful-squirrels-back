import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Article } from '../models/articles.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

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

    res.status(200).json({
      status: 200,
      message: 'Avatar updated successfully',
      data: {
        avatarUrl: updatedUser.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
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

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getSavedArticles = async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedArticles');

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json(user.savedArticles);
};

export const getCreatedArticles = async (req, res) => {
  const { userId } = req.params;

  const articles = await Article.find({
    ownerId: userId,
  });

  res.status(200).json(articles);
};

export const addSavedArticle = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { articleId } = req.body;

    if (!articleId) {
      throw createHttpError(400, "Article ID not provided");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedArticles: articleId } },
      { new: true }
    );

    if (!updatedUser) {
      throw createHttpError(400, "User not found");
    }

    res.status(200).json({
      message: 'The article has been successfully added to saved items',
      savedArticles: updatedUser.savedArticles
    });
  } catch (error) {
    next(error);
  }
};

export const removeSavedArticle = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { articleId } = req.body;

    if (!articleId) {
      throw createHttpError(400, "Article ID not provided");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedArticles: articleId } },
      { new: true }
    );

    if (!updatedUser) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json({
      message: 'The article has been successfully removed from saved items',
      savedArticles: updatedUser.savedArticles
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user._id;
  const updatedUser = await User.findOneAndUpdate(
     userId,
      req.body,
      { returnDocument: 'after' },
    );
  if (!updatedUser) {
    throw createHttpError(404, '❌ Note not found');
  }
  res.status(200).json(updatedUser);
};

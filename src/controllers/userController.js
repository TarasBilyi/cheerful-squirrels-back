import { User } from '../models/User.js';
import createHttpError from 'http-errors';

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

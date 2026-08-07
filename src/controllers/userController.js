import { User } from "../models/user.js";
import createHttpError from "http-errors";
export const addSavedArticle = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { articleId } = req.body;

    if (!articleId) {
      throw createHttpError(400, "Не передано ID статті");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedArticles: articleId } },
      { new: true }
    );

    if (!updatedUser) {
      throw createHttpError(400, "Користувача не знайдено");
    }

    res.status(200).json({
      message: 'Статтю успішно додано до збережених',
      savedArticles: updatedUser.savedArticles
    });
  } catch (error) {
    next(error);
  }
};

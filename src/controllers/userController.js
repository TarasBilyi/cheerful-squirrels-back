import createHttpError from "http-errors";
import { User } from "../models/user.js";
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
      { returnDocument: "after" }
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

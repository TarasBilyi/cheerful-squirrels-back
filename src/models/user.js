import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 32,
    },
    avatarUrl: {
      type: String,
      required: false,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
    articlesAmount: {
      type: Number,
      default: 0,
    },
    savedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    subscriptions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 64,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 64,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Видалення пароля із об'єкта користувача перед відправкою у відповідь
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);

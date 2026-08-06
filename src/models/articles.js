import { Schema, model } from 'mongoose';

const articleSchema = new Schema(
  {
    img: { type: String, required: true },
    title: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
      minlength: 1,
    },
    desc: {
      type: String,
      default: '',
      trim: true, // прибирає пробіли на початку та в кінці
    },
    article: {
      type: String,
      required: true,
    },
    rate: { type: Number, default: 0, min: 0 },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

articleSchema.index({ ownerId: 1 });

export const Article = model('Article', articleSchema);

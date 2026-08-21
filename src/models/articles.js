import { Schema, model } from 'mongoose';

const articleSchema = new Schema(
  {
    img: { type: String, required: true },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    desc: {
      type: String,
      default: '',
      trim: true,
    },
    article: {
      type: String,
      required: true,
      validate: [
        {
          validator: value => /\S/.test(value.replace(/<[^>]*>/g, ' ')),
          message: 'Article body must contain visible text, not just whitespace',
        },
        {
          validator: value => {
            const length = value.replace(/<[^>]*>/g, '').length;
            return length >= 100 && length <= 4000;
          },
          message: 'Article body must be between 100 and 4000 characters',
        },
      ],
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

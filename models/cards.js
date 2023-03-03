const mongoose = require('mongoose');

const cardSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      required: true,
    },
    link: {
      type: String,
      validate: {

      },
      required: true,
    },
    owner: {
   
      ref: 'user',
      required: true,
    },
    likes: {
      type: [
        {

        },
      ],
      default: [],
    },
    createdAt: {

    },
  },
  { versionKey: false },
);

export default model('card', cardSchema);
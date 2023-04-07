const mongoose = require("mongoose");

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
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

export default mongoose.model("card", cardSchema);

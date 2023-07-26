const mongoose = require("mongoose");

// Define the user schema
const commentsSchema = new mongoose.Schema({
  parent_id: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  avatar:{
    type: String,
    required: true,
  },
  author_id: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  replies: [
    {
      author: {
        type: String,
      },
      author_id: {
        type: String,
      },
      comment: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model
const Comments = mongoose.model("Comments", commentsSchema);

module.exports = Comments;

const mongoose = require("mongoose");

// Define the user schema
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },
  thumbnail: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  likes: [
    {
      type: String,
    },
  ],
  shares: [
    {
      type: String,
    },
  ],
});

// Create the User model
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

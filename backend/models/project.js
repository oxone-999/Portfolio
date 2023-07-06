const mongoose = require('mongoose');

// Define the user schema
const projectSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  github: {
    type: String,
    required: true,
  },
  file: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  preview: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

// Create the User model
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

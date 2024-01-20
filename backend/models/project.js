const mongoose = require("mongoose");

// Define the user schema
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  projectDescription: {
    companyName:{
      type: String,
    },
    role:{
      type:String,
    },
    points:{
      type:String,
    },
    skills:{
      type:String,
    }
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
      },
      url: {
        type: String,
      },
      name:{
        type:String,
      },
      description:{
        type: String,
      }
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

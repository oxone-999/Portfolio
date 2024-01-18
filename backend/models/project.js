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
      required: true,
    },
    role:{
      type:String,
      required:true,
    },
    points:{
      type:String,
      required:true,
    },
    skills:{
      type:String,
      required:true,
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

require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const projectController = require("./controllers/projectControllers");
const getProjectController = require("./controllers/getProjectControllers");
const middleware = require("./middlewares/middleware");
const loginController = require("./controllers/userLogin");
const signupController = require("./controllers/userSignup");
const imageController = require("./controllers/imageControllers");
const getRepliesController = require("./controllers/getRepliesController");
const replyController = require("./controllers/replyController");
const getUserController = require("./controllers/getUserController");

const app = express();

app.use(middleware);

const port = process.env.PORT || 5001;

connectDB();

app.get("/api/images", getProjectController.getImages);
app.get("/api/images/:id", getProjectController.getImageById);
app.post("/api/add", projectController.createProject);

app.put("/api/images/:id", projectController.updateProject);
app.delete("/api/projects/:projectId/images/:id", imageController.deleteImage);

app.post("/api/auth/login", loginController.Login);
app.post("/api/auth/signup", signupController.Signup);

app.get("/api/replies/:id", getRepliesController.getRepliesById);
app.post("/api/replies/:parent_id", replyController.createReply);

app.put("/api/projects/:id", projectController.updateProjectLikeShare);
app.put("/api/projects/thumbnail/:id", projectController.updateThumbnail);
app.get("/api/projects/likes/:id", getProjectController.getProjectLikes);
app.get("/api/projects/shares/:id", getProjectController.getProjectShares);

app.post("/api/projects/work/:id/", projectController.updateWork);

app.get("/api/users", getUserController.getUsers);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
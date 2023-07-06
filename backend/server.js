require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const projectController = require('./controllers/projectControllers');
const getProjectController = require('./controllers/getProjectControllers');
const middleware = require('./middlewares/middleware');
const loginController = require('./controllers/userLogin');
const signupController = require('./controllers/userSignup');

const app = express();
app.use(middleware);

const port = process.env.PORT || 5000;

connectDB();

app.get('/api/images', getProjectController.getImages);
app.post('/api/add', projectController.createProject);

app.post('/api/auth/login', loginController.Login);
app.post('/api/auth/signup', signupController.Signup);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
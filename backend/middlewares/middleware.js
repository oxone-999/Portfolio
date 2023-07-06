const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Body Parser Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// CORS Middleware
app.use(cors());

// Static Files Middleware
app.use(express.static('public'));

module.exports = app;

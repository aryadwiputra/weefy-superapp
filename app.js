const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');

const indexRouter = require('./routes/index');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const v1 = '/api/v1/cms';

// Router
const categoriesRouter = require('./app/api/v1/categories/router');
const authRouter = require('./app/api/v1/auth/router');
const usersRouter = require('./app/api/v1/users/router');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(v1, categoriesRouter);
app.use(v1, authRouter);
app.use(v1, usersRouter);

module.exports = app;

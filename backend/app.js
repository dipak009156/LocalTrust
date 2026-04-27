require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const morgan = require('morgan');
app.use(morgan('dev'));

app.use('/api/auth', require('./routes/authRoute'));
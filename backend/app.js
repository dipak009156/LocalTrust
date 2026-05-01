require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/categories', require('./routes/categoryRoute'));
app.use('/api/bookings', require('./routes/bookingRoute'));
app.use('/api/workers', require('./routes/workerRoute'));
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/disputes', require('./routes/disputeRoute'));
app.use('/api/reviews', require('./routes/reviewRoute'));
app.use('/api/admin', require('./routes/adminRoute'));

module.exports = app;

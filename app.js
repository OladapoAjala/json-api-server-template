/**
 * This file contains code for express server.
 * Includes:
 *    1. Route handlers
 *    2. Data sanitization
 *    3. Prevention against parameter pollution
 *    4. Rate limit
 */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Error handlers
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Import route handlers (here's a sample route for user)
const userRouter = require('./routes/userRoutes');

// Create an instance of express
const app = express();

// MIDDLEWARES
// console.log(process.env.NODE_ENV);
app.use(helmet());

// Log client requests if server is running in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit total requests from a single IP address (after 100 requests wait for an hour before logging another request)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP address',
});

app.use('/api', limiter);

// JSON Parser for requests from the client
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Use this to serve static files to the client
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// Middlewares to mount routers to specific routes (here's a sample mounting user route handler)
app.use('/api/v1/users', userRouter);

// Catch all unhandled URLs
app.all('*', (req, res, next) => {
  next(new AppError(`Invalid URI: ${req.originalUrl} requested!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;

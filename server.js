const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Handle all programming error (non operational error)
process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION: shutting down gracefully');
  console.log(err);
  console.log(err.name, err.message);

  process.exit(1);
});

// Set path to environmental variables
dotenv.config({ path: './config.env' });

// Set mongodb url (localhost connects to mongodb hosted locally)
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );
const DB =
  'mongodb://localhost:27017/natours?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

// Connect to mongodb
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Handle mongodb connection errors (This links up with the uncaughtException error handler which gracefully shuts down the application)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database successfully');
});

// Import express application
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Catch all unhandled rejection errors
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED EXCEPTION: shutting down gracefully');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

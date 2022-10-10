var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var departmentsRouter = require('./routes/departments');
var productsRouter = require('./routes/products');
var requestsRouter = require('./routes/requests');
var startQueries = require("./sequelize/queries/start.queries");

var app = express();
const sequelize = require("./sequelize/sequelize");
var config = require("./bin/config.json");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/department', departmentsRouter);
app.use('/product', productsRouter);
app.use('/request', requestsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err.status == 404) {
    res.status(404).json({
      errors: 'Not found service',
      success: false
    });
  }
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || config.serverPort);
app.set('port', port);

var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || config.serverPort);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**Create Sqlite database schema structure if no exist */
async function DatabaseConnection() {
  console.log("Checking database connection...");
  try {
    await sequelize.authenticate();
    console.warn("Database connection OK!");
    sequelize.sync();
    console.warn("Synchronizing database");
  } catch (error) {
    console.warn("Unable to connect to the database: " + error.message);
    process.exit(1);
  }
}


/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  console.warn('Listening on ' + bind);
  DatabaseConnection();
  setTimeout(() => {
    startQueries.addFirstUser();
    startQueries.addFirtsDepartments();
  }, 2000);
}


module.exports = app;
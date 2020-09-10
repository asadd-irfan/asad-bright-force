const path = require('path');
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');


const rateLimit = require("express-rate-limit");
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
var cookieParser = require('cookie-parser')


const bodyParser = require('body-parser')
const cors = require('cors');

dotenv.config();
const talentRoutes = require('./server/talent/routes/index')
const companyRoutes = require('./server/company/routes/index')
const globalErrorHandler = require('./server/utils/app-error-controller');
const adminRoutes = require('./server/admin/routes/index')

const connectDB = require('./server/configs/db');

const cronJob = require('./server/cronjob/filter-talent')
const rabbitMq = require('./server/rabbitmq/worker');

global.root_dir = __dirname;

// Initialize express
const app = express();
if (process.env.RUN_CRONJOBS === "true") {
  console.log('scheduling cronjob')
  cronJob.processedTalentsForPosition();
  cronJob.dispatchedTalentsForPosition();
  rabbitMq.rabbitMqWorker();
}


app.use(cors());


app.use(helmet())

// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100
// });
// only apply to requests that begin with /api/
// app.use("/api/", apiLimiter);

app.use(express.json({ limit: '10kb' }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10kb' }));

app.use(cookieParser());

// To remove data, use:
app.use(mongoSanitize());


// Connect to Database
connectDB();
//Initialize Middleware
if (process.env.ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  express.json({
    extended: false
  })
);

// static files middleware
app.use('/uploads/talent/resumes/', express.static(path.join(__dirname, 'uploads/talent/resumes')));
app.use('/uploads/talent/profileImages/', express.static(path.join(__dirname, 'uploads/talent/profileImages')));
app.use('/uploads/company/logos/', express.static(path.join(__dirname, 'uploads/company/logos')));
app.use('/uploads/company/bannerImages/', express.static(path.join(__dirname, 'uploads/company/bannerImages')));
app.use('/uploads/company/user/profileImages/', express.static(path.join(__dirname, 'uploads/company/user/profileImages')));
app.use('/uploads/admin/profileImages/', express.static(path.join(__dirname, 'uploads/admin/profileImages')));

// Define routes
app.use('/api/company', companyRoutes);
app.use('/api/talent', talentRoutes);
app.use('/api/admin', adminRoutes);

// if (process.env.NODE_ENV === 'production') {
// Serve company app static files
app.use('/company', express.static(path.join(__dirname, 'client_company/build')));
// Serve company app
app.get('/company/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client_company', 'build', 'index.html'));
});
// Serve talent app static files
app.use('/talent', express.static(path.join(__dirname, 'client_talent/build')));
// Serve talent app
app.get('/talent/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client_talent', 'build', 'index.html'));
});
// Serve talent app static files
app.use('/admin', express.static(path.join(__dirname, 'client_admin/build')));
// Serve talent app
app.get('/admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client_admin', 'build', 'index.html'));
});
// Serve main app static files
app.use('/', express.static(path.join(__dirname, 'client_main/build')));
// Serve main app
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client_main', 'build', 'index.html'));
});

// }

// Listen on PORT
const PORT = process.env.PORT || 8000;
app.use(globalErrorHandler);
app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));

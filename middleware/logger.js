// Bring in moment [third party package to track date/time]
const moment = require('moment');

// middleware to log url visited with date/time
const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}:${moment().format()}`);
    next();
};

module.exports = logger;


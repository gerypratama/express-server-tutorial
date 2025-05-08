const { logEvents } = require('./logEvents')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'error.log');
    res.status(500).send(err.message);
}

module.exports = errorHandler;
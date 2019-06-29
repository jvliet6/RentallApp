// The downloaded libraries and connections to other classes.
const express               = require('express');
const logger                = require('./src/config/appconfig').logger;
const authenticationRoutes  = require('./src/routes/authentication.routes');
const apartmentRoutes       = require('./src/routes/apartment.routes');
const reservationRoutes     = require('./src/routes/reservation.routes');

const app  = express();
const port = process.env.PORT || 6000;

app.use(express.json());

// Starting point for the application.
app.all('*', (req, res, next) => {
   const { method, url } = req;
    logger.info(`${method} ${url}`);
   next()
});

// Connection to the routes.
app.use('/api', authenticationRoutes);
app.use('/api', apartmentRoutes);
app.use('/api', reservationRoutes);

// If url does not exists.
app.all("*", (req, res, next) => {
    const {method, url} = req;
    const errorMessage = `${method} ${url} does not exist.`;

    const errorObject = {
        message: errorMessage,
        code: 404,
        date: new Date()
    };
    next(errorObject);
});

// Giving back the error to the user (Error handler).
app.use((error, req, res, next) => {
   logger.error("Error handler: ", error.message.toString());
   res.status(error.code).json(error);
});

// Starting message after npm start.
app.listen(port, () => logger.info(`Welcome to the App, listen on port ${port}!`));

module.exports = app;

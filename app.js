const express               = require('express');
const logger                = require('./src/config/appconfig').logger;
const authenticationRoutes  = require('./src/routes/authentication.routes');
const apartmentRoutes       = require('./src/routes/apartment.routes');
const reservationRoutes     = require('./src/routes/reservation.routes');

const app  = express();
const port = process.env.PORT || 6000;

app.use(express.json());

app.all('*', (req, res, next) => {
   const { method, url } = req;
    logger.info(`${method} ${url}`);
   next()
});

app.use('/api', authenticationRoutes);
app.use('/api', apartmentRoutes);
app.use('/api', reservationRoutes);

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

app.use((error, req, res, next) => {
   logger.error("Error handler: ", error.message.toString());
   res.status(error.code).json(error);
});

app.listen(port, () => logger.info(`Welcome to the App, listen on port ${port}!`));

module.exports = app;

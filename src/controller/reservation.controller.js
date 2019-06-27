const logger    = require('../config/appconfig').logger;
const database  = require('../datalayer/mssql.dao');
const assert    = require('assert');

module.exports = {
    createReservation: (req, res, next) => {
        logger.info('createReservation is called.');
        const id = req.params.id;
        const reservation = req.body;

        logger.info(reservation);
        try {
            assert.equal(typeof reservation.startDate, 'string', 'startDate is required.');
            assert.equal(typeof reservation.endDate, 'string', 'endDate is required.');
        } catch (e) {
            const errorObject = {
                message: 'Validation fails: ' + e.toString(),
                code: 400
            };
            return next(errorObject)
        }

        var startDate = reservation.startDate;
        var endDate = reservation.endDate;
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        if (startDate > endDate) {
            const errorObject = {
                message: 'End date is not after start date of reservation.',
                code: 400
            };
            return next(errorObject);
        }

        const query =
            "INSERT INTO Reservation(ApartmentId, StartDate, EndDate, Status, UserId) VALUES ('" +
            id +
            "','" +
            reservation.startDate +
            "','" +
            reservation.endDate +
            "','" +
            'INITIAL' +
            "','" +
            req.userId +
            "');";

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: "Error at INSERT INTO Reservation.",
                    code: 500
                };
                next(errorObject)
            }

            if (rows) {
                res.status(200).json({message: "Reservation is created."})
            }
        })
    },

    getAllReservations: (req, res, next) => {
        logger.info('getAllReservations is called.');
        const id = req.params.id;

        const query = `SELECT * FROM Reservation WHERE Reservation.ApartmentId=${id};`;

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: 'Error at database.',
                    code: 500
                };
                next(errorObject)
            }

            if (rows) {
                if (rows.recordset.length > 0) {
                    res.status(200).json({result: rows.recordset})
                } else {
                    const errorObject = {
                        message: 'No reservations found!',
                        code: 404
                    };
                    next(errorObject);
                }
            }
        })
    },

    getReservationById: (req, res, next) => {
        logger.info('getReservationById is called.');
        const id = req.params.id;

        const query = `SELECT * FROM Reservation WHERE ReservationId = ${id};`;

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: 'Error at database.',
                    code: 500
                };
                next(errorObject)
            }

            if (rows) {
                if (rows.recordset.length > 0) {
                    res.status(200).json({result: rows.recordset})
                } else {
                    const errorObject = {
                        message: 'No reservation found!',
                        code: 404
                    };
                    next(errorObject);
                }
            }
        })
    },

    updateReservationById: (req, res, next) => {
        logger.info('updateReservationById is called.');
        const reservationId = req.params.reservationId;
        const apartmentId = req.params.apartmentId;
        const userId = req.userId;
        const status = req.body.status;

        const query = `UPDATE Reservation SET Reservation.Status='${status}' FROM Reservation INNER JOIN Apartment ON Reservation.ApartmentId = Apartment.ApartmentId AND Reservation.UserId = Apartment.UserId WHERE Reservation.UserId=${userId} AND Reservation.ApartmentId=${apartmentId} AND Reservation.ReservationId=${reservationId} `;

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: "Error at UPDATE Reservation.",
                    code: 500
                };
                next(errorObject)
            }

            if (rows) {
                if (rows.rowsAffected[0] === 0) {
                    const errorObject = {
                        message: 'Reservation not found or not authorized to update this reservation.',
                        code: 401
                    };
                    next(errorObject);
                } else {
                    res.status(200).json({message: 'Reservation updated!'})
                }
            }
        })
    },

    deleteReservationById: (req, res, next) => {
        logger.info('deleteReservationById is called.');
        const reservationId = req.params.reservationId;
        const userId = req.userId;

        const query = `DELETE FROM Reservation WHERE ReservationId=${reservationId} AND UserId=${userId}`;

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: 'Error at DELETE FROM Reservation.',
                    code: 500
                };
                next(errorObject);

            }
            if (rows) {
                if (rows.rowsAffected[0] === 0) {
                    const errorObject = {
                        message: 'Reservation not found or not authorized to delete this reservation.',
                        code: 401
                    };
                    next(errorObject);
                } else {
                    res.status(200).json({ message: 'Reservation is deleted.' })
                }
            }
        });
    }
};

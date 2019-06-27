const logger    = require('../config/appconfig').logger;
const database  = require('../datalayer/mssql.dao');
const assert    = require('assert');

const postalCodeValidator = new RegExp('^([1-9][0-9]{3})([ ]{0,1})(?!SD|sd|SS|ss|SA|sa)([a-zA-Z]{2})$');

module.exports = {
    createApartment: (req, res, next) => {
        logger.info('createApartment is called.');
        logger.trace('User id: ', req.userId);
        const apartment = req.body;

        try {
            assert.equal(typeof apartment.description, 'string', 'description is required.');
            assert.equal(typeof apartment.streetAddress, 'string', 'streetAddress is required.');
            assert.equal(typeof apartment.city, 'string', 'city is required.');
            assert(postalCodeValidator.test(apartment.postalCode), 'A valid postalCode is required.');
        } catch (e) {
            const errorObject = {
                message: 'Validation fails: ' + e.toString(),
                code: 400
            };
            return next(errorObject)
        }

        const query =
            "INSERT INTO Apartment(Description, StreetAddress, PostalCode, City, UserId) VALUES ('" +
            apartment.description +
            "','" +
            apartment.streetAddress +
            "','" +
            apartment.postalCode +
            "','" +
            apartment.city +
            "','" +
            req.userId +
            "'); SELECT ApartmentId FROM Apartment INNER JOIN DBUser ON Apartment.UserId = DBUser.UserId WHERE ApartmentId = SCOPE_IDENTITY();";

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: "Error at INSERT INTO Apartment.",
                    code: 500
                };
                next(errorObject)
            }

            if (rows) {
                res.status(200).json({result: rows.recordset})
            }
        })
    },

    getAllApartments: (req, res, next) => {
      logger.info('getAllApartments is called.');

      const query = 'SELECT * FROM Apartment ' + 'INNER JOIN DBUser ON (Apartment.UserId = DBUser.UserId)';

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: 'Error at query.',
                    code: 500
                };
                next(errorObject);
            }

            if (rows) {
                if(rows.recordset.length > 0){
                    res.status(200).json({result: rows.recordset})
                } else {
                    const errorObject = {
                        message: 'No apartments found!',
                        code: 404
                    };
                    next(errorObject);
                }
            }
        })
    },

    getApartmentById: (req, res, next) => {
        logger.info('getApartmentById is called.');
        const id = req.params.id;

        const query = 'SELECT * FROM Apartment ' +
            'FULL OUTER JOIN DBUser ON (Apartment.UserId = DBUser.UserId) ' +
            'FULL OUTER JOIN Reservation ON (Apartment.ApartmentId = Reservation.ApartmentId) '+
            `WHERE Apartment.ApartmentId = ${id}`;

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: 'Error at query.',
                    code: 500
                };
                next(errorObject)
            }

            if (rows) {
                if(rows.recordset.length > 0){
                    res.status(200).json({result: rows.recordset})
                } else {
                    const errorObject = {
                        message: 'No apartment found!',
                        code: 404
                    };
                    next(errorObject);
                }
            }
        })
    },

    updateApartmentById: (req, res, next) => {
      logger.info('updateApartmentById is called.');
      const id = req.params.id;
      const userId = req.userId;
      const apartment = req.body;

        try {
            assert.equal(typeof apartment.description, 'string', 'description is required.');
            assert.equal(typeof apartment.streetAddress, 'string', 'streetAddress is required.');
            assert.equal(typeof apartment.city, 'string', 'city is required.');
            assert(postalCodeValidator.test(apartment.postalCode), 'A valid postalCode is required.');
        } catch (e) {
            const errorObject = {
                message: 'Validation fails: ' + e.toString(),
                code: 500
            };
            return next(errorObject)
        }

        const query =
            `UPDATE Apartment ` +
            `SET Description = '${apartment.description}', StreetAddress = '${apartment.streetAddress}', PostalCode = '${apartment.postalCode}', City = '${apartment.city}' ` +
            `WHERE ApartmentId = ${id} AND UserId = ${userId} ` +
            `; SELECT * FROM Apartment WHERE ApartmentId = ${id}`;

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: "Error at UPDATE Apartment.",
                    code: 500
                };
                next(errorObject)
            }

            if (rows) {
                if (rows.rowsAffected[0] === 0) {
                    const errorObject = {
                        message: 'Apartment not found or not authorized to update this apartment.',
                        code: 401
                    };
                    next(errorObject)
                } else {
                    res.status(200).json({
                        message: "Apartment is updated!",
                        result: rows.recordset
                    })
                }
            }
        })
    },

    deleteApartmentById: (req, res, next) => {
      logger.info('deleteApartment is called.');
      const id     = req.params.id;
      const userId = req.userId;

      const query = `DELETE FROM Apartment WHERE ApartmentId = ${id} AND UserId = ${userId};`;

        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: 'Error at query.',
                    code: 500
                };
                next(errorObject)
            }

            if (rows) {
                if (rows.rowsAffected[0] === 0) {
                    const errorObject = {
                        message: 'Apartment not found or not authorized to delete this apartment.',
                        code: 401
                    };
                    next(errorObject)
                } else {
                    res.status(200).json({message: "Apartment is deleted!"})
                }
            }
        })
    }
};

// The downloaded libraries and connections to other classes.
const chai      = require('chai');
const chaiHttp  = require('chai-http');
const jwt       = require('jsonwebtoken');
const server    = require('../app.js');

chai.should();
chai.use(chaiHttp);

let token;

// Getting access by adding the jwt token to the payload (UserId).
before(() => {
    console.log('before');

    const payload = {
        UserId: 696
    };
    jwt.sign({ data: payload }, 'secretkey', { expiresIn: 60 * 60 }, (err, result) => {
        if (result) {
            token = result;
        }
    })
});

beforeEach(() => {
    console.log('- beforeEach')
});

describe('POST Apartment', () => {
   it('Create valid apartment.', done => {
       chai.request(server)
           .post('/api/apartments')
           .set('Authorization', 'Bearer ' + token)
           .send({
               "description": "Test Apartment",
               "streetAddress": "Kapeldreef 15",
               "city": "Breda",
               "postalCode": "4635AB"
           })
           .end(function (err, res, body) {
               res.should.have.status(200);
               res.body.should.be.a('object');
               done();
           })
   });

    it('Create not valid apartment.', done => {
        chai.request(server)
            .post('/api/apartments')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "description": "Test Apartment",
                "streetAddress": "Kapeldreef 15",
                "city": "Breda",
                "postalCode": "123"
            })
            .end(function (err, res, body) {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            })
    })
});

describe('GET Apartment', () => {
    it('Get all apartments.', done => {
        chai.request(server)
            .get('/api/apartments')
            .end(function(err, res, body) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Get apartment by valid id.', done => {
        chai.request(server)
            .get('/api/apartments/1780')
            .end(function (err, res, body) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Get apartment by not valid id.', done => {
        chai.request(server)
            .get('/api/apartments/0')
            .end(function (err, res, body) {
                res.should.have.status(404);
                done();
            })
    })
});

describe('PUT Apartment', () => {
   it('Update apartment.', done => {
       chai.request(server)
           .put('/api/apartments/1780')
           .set('Authorization', 'Bearer ' + token)
           .send({
               "description": "Apartment at Brooklyn",
               "streetAddress": "Avenue 55",
               "city": "New York",
               "postalCode": "7356CB"
           })
           .end(function (err, res, body) {
               res.should.have.status(200);
               res.body.should.be.a('object');
               done();
           })
   });

    it('Update apartment with not valid postalCode.', done => {
        chai.request(server)
            .put('/api/apartments/1780')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "description": "Apartment at Brooklyn",
                "streetAddress": "Avenue 55",
                "city": "New York",
                "postalCode": "123"
            })
            .end(function (err, res, body) {
                res.should.have.status(500);
                done();
            })
    });

    it('Update apartment with not valid id.', done => {
        chai.request(server)
            .put('/api/apartments/1774')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "description": "Apartment at Brooklyn",
                "streetAddress": "Avenue 55",
                "city": "New York",
                "postalCode": "4635AB"
            })
            .end(function (err, res, body) {
                res.should.have.status(401);
                done();
            })
    });

    it('Update apartment with not valid token.', done => {
        chai.request(server)
            .put('/api/apartments/1780')
            .set('Authorization', 'Bearer ' + "cnrehfuerhfuir3673628")
            .send({
                "description": "Apartment at Brooklyn",
                "streetAddress": "Avenue 55",
                "city": "New York",
                "postalCode": "4635AB"
            })
            .end(function (err, res, body) {
                res.should.have.status(401);
                done();
            })
    })
});

describe('DELETE Apartment', () => {
   it('Delete apartment.', done => {
       chai.request(server)
           .delete('/api/apartments/1927')
           .set('Authorization', 'Bearer ' + token)
           .end(function (err, res, body) {
               res.should.have.status(200);
               done()
           })
   });

    it('Delete apartment with invalid id.', done => {
        chai.request(server)
            .delete('/api/apartments/0')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res, body) {
                res.should.have.status(401);
                done()
            })
    });

    it('Delete apartment with invalid token.', done => {
        chai.request(server)
            .delete('/api/apartments/1780')
            .set('Authorization', 'Bearer ' + "ruiferufrej389328")
            .end(function (err, res, body) {
                res.should.have.status(401);
                done()
            })
    });
});

describe('POST Reservation', () => {
   it('Create reservation.', done => {
       chai.request(server)
           .post('/api/apartments/1780/reservations')
           .set('Authorization', 'Bearer ' + token)
           .send({
               "startDate": "2019-07-09",
               "endDate": "2019-07-31"
           })
           .end(function (err, res, body) {
               res.should.have.status(200);
               done()
           })
   });

    it('Create reservation with invalid id.', done => {
        chai.request(server)
            .post('/api/apartments/0/reservations')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "startDate": "2019-07-09",
                "endDate": "2019-07-31"
            })
            .end(function (err, res, body) {
                res.should.have.status(401);
                done()
            })
    });

    it('Create reservation with invalid token.', done => {
        chai.request(server)
            .post('/api/apartments/1780/reservations')
            .set('Authorization', 'Bearer ' + "jriejcrnfcihr3827484")
            .send({
                "startDate": "2019-07-09",
                "endDate": "2019-07-31"
            })
            .end(function (err, res, body) {
                res.should.have.status(401);
                done()
            })
    })
});

describe('GET Reservations', () => {
   it('Get reservation by apartmentId.', done => {
       chai.request(server)
           .get('/api/apartments/1780/reservations')
           .set('Authorization', 'Bearer ' + token)
           .end(function (err, res, body) {
               res.should.have.status(200);
                res.body.should.be.a('object');
                done();
           })
   });

    it('Get reservation by invalid apartmentId.', done => {
        chai.request(server)
            .get('/api/apartments/0/reservations')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res, body) {
                res.should.have.status(404);
                done();
            })
    });

    it('Get reservation by reservationId.', done => {
        chai.request(server)
            .get('/api/apartments/reservations/1255')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res, body) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done()
            })
    });

    it('Get reservation by invalid reservationId.', done => {
        chai.request(server)
            .get('/api/apartments/reservations/0')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res, body) {
                res.should.have.status(404);
                done()
            })
    });
});

describe('PUT Reservation', () => {
   it('Update reservation.', done => {
    chai.request(server)
        .put('/api/apartments/1780/reservations/1255')
        .set('Authorization', 'Bearer ' + token)
        .send({
            "status": "ACCEPTED"
        })
        .end(function (err, res, body) {
            res.should.have.status(200);
            done()
        })
   });

    it('Update reservation with invalid apartmentId.', done => {
        chai.request(server)
            .put('/api/apartments/0/reservations/1255')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "status": "ACCEPTED"
            })
            .end(function (err, res, body) {
                res.should.have.status(401);
                done()
            })
    });

    it('Update reservation with invalid reservationId.', done => {
        chai.request(server)
            .put('/api/apartments/1780/reservations/0')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "status": "ACCEPTED"
            })
            .end(function (err, res, body) {
                res.should.have.status(401);
                done()
            })
    });

    it('Update reservation with invalid token.', done => {
        chai.request(server)
            .put('/api/apartments/1780/reservations/1255')
            .set('Authorization', 'Bearer ' + "cnfihcvuef32728")
            .send({
                "status": "ACCEPTED"
            })
            .end(function (err, res, body) {
                res.should.have.status(401);
                done()
            })
    });
});

describe('DELETE Reservation', () => {
    it('Delete reservation.', done => {
        chai.request(server)
            .delete('/api/apartments/reservations/1287')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res, body) {
                res.should.have.status(200);
                done()
            })
    });

    it('Delete reservation with invalid reservationId.', done => {
        chai.request(server)
            .delete('/api/apartments/reservations/0')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res, body) {
                res.should.have.status(401);
                done()
            })
    });

    it('Delete reservation with invalid token.', done => {
        chai.request(server)
            .delete('/api/apartments/reservations/1780')
            .set('Authorization', 'Bearer ' + "cnfjechfed37823732")
            .end(function (err, res, body) {
                res.should.have.status(401);
                done()
            })
    });
});



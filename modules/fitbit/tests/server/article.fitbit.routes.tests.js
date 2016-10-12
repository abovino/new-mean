'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  FitBit = mongoose.model('FitBit'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  fitbit;

/**
 * FitBit routes tests
 */
describe('FitBit CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new fitbit
    user.save(function () {
      fitbit = {
        title: 'FitBit Title',
        content: 'FitBit Content'
      };

      done();
    });
  });

  it('should not be able to save an fitbit if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/fitbits')
          .send(fitbit)
          .expect(403)
          .end(function (fitbitSaveErr, fitbitSaveRes) {
            // Call the assertion callback
            done(fitbitSaveErr);
          });

      });
  });

  it('should not be able to save an fitbit if not logged in', function (done) {
    agent.post('/api/fitbits')
      .send(fitbit)
      .expect(403)
      .end(function (fitbitSaveErr, fitbitSaveRes) {
        // Call the assertion callback
        done(fitbitSaveErr);
      });
  });

  it('should not be able to update an fitbit if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/fitbits')
          .send(fitbit)
          .expect(403)
          .end(function (fitbitSaveErr, fitbitSaveRes) {
            // Call the assertion callback
            done(fitbitSaveErr);
          });
      });
  });

  it('should be able to get a list of fitbits if not signed in', function (done) {
    // Create new fitbit model instance
    var fitbitObj = new FitBit(fitbit);

    // Save the fitbit
    fitbitObj.save(function () {
      // Request fitbits
      request(app).get('/api/fitbits')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single fitbit if not signed in', function (done) {
    // Create new fitbit model instance
    var fitbitObj = new FitBit(fitbit);

    // Save the fitbit
    fitbitObj.save(function () {
      request(app).get('/api/fitbits/' + fitbitObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', fitbit.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single fitbit with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/fitbits/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'FitBit is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single fitbit which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent fitbit
    request(app).get('/api/fitbits/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No fitbit with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an fitbit if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/fitbits')
          .send(fitbit)
          .expect(403)
          .end(function (fitbitSaveErr, fitbitSaveRes) {
            // Call the assertion callback
            done(fitbitSaveErr);
          });
      });
  });

  it('should not be able to delete an fitbit if not signed in', function (done) {
    // Set fitbit user
    fitbit.user = user;

    // Create new fitbit model instance
    var fitbitObj = new FitBit(fitbit);

    // Save the fitbit
    fitbitObj.save(function () {
      // Try deleting fitbit
      request(app).delete('/api/fitbits/' + fitbitObj._id)
        .expect(403)
        .end(function (fitbitDeleteErr, fitbitDeleteRes) {
          // Set message assertion
          (fitbitDeleteRes.body.message).should.match('User is not authorized');

          // Handle fitbit error error
          done(fitbitDeleteErr);
        });

    });
  });

  it('should be able to get a single fitbit that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new fitbit
          agent.post('/api/fitbits')
            .send(fitbit)
            .expect(200)
            .end(function (fitbitSaveErr, fitbitSaveRes) {
              // Handle fitbit save error
              if (fitbitSaveErr) {
                return done(fitbitSaveErr);
              }

              // Set assertions on new fitbit
              (fitbitSaveRes.body.title).should.equal(fitbit.title);
              should.exist(fitbitSaveRes.body.user);
              should.equal(fitbitSaveRes.body.user._id, orphanId);

              // force the fitbit to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the fitbit
                    agent.get('/api/fitbits/' + fitbitSaveRes.body._id)
                      .expect(200)
                      .end(function (fitbitInfoErr, fitbitInfoRes) {
                        // Handle fitbit error
                        if (fitbitInfoErr) {
                          return done(fitbitInfoErr);
                        }

                        // Set assertions
                        (fitbitInfoRes.body._id).should.equal(fitbitSaveRes.body._id);
                        (fitbitInfoRes.body.title).should.equal(fitbit.title);
                        should.equal(fitbitInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single fitbit if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new fitbit model instance
    var fitbitObj = new FitBit(fitbit);

    // Save the fitbit
    fitbitObj.save(function () {
      request(app).get('/api/fitbits/' + fitbitObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', fitbit.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single fitbit, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'fitbitowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the FitBit
    var _fitbitOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _fitbitOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the FitBit
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new fitbit
          agent.post('/api/fitbits')
            .send(fitbit)
            .expect(200)
            .end(function (fitbitSaveErr, fitbitSaveRes) {
              // Handle fitbit save error
              if (fitbitSaveErr) {
                return done(fitbitSaveErr);
              }

              // Set assertions on new fitbit
              (fitbitSaveRes.body.title).should.equal(fitbit.title);
              should.exist(fitbitSaveRes.body.user);
              should.equal(fitbitSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the fitbit
                  agent.get('/api/fitbits/' + fitbitSaveRes.body._id)
                    .expect(200)
                    .end(function (fitbitInfoErr, fitbitInfoRes) {
                      // Handle fitbit error
                      if (fitbitInfoErr) {
                        return done(fitbitInfoErr);
                      }

                      // Set assertions
                      (fitbitInfoRes.body._id).should.equal(fitbitSaveRes.body._id);
                      (fitbitInfoRes.body.title).should.equal(fitbit.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (fitbitInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      FitBit.remove().exec(done);
    });
  });
});

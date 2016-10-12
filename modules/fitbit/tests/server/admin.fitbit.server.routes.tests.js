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
describe('FitBit Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an fitbit if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new fitbit
        agent.post('/api/fitbits')
          .send(fitbit)
          .expect(200)
          .end(function (fitbitSaveErr, fitbitSaveRes) {
            // Handle fitbit save error
            if (fitbitSaveErr) {
              return done(fitbitSaveErr);
            }

            // Get a list of fitbits
            agent.get('/api/fitbits')
              .end(function (fitbitsGetErr, fitbitsGetRes) {
                // Handle fitbit save error
                if (fitbitsGetErr) {
                  return done(fitbitsGetErr);
                }

                // Get fitbits list
                var fitbits = fitbitsGetRes.body;

                // Set assertions
                (fitbits[0].user._id).should.equal(userId);
                (fitbits[0].title).should.match('FitBit Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an fitbit if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new fitbit
        agent.post('/api/fitbits')
          .send(fitbit)
          .expect(200)
          .end(function (fitbitSaveErr, fitbitSaveRes) {
            // Handle fitbit save error
            if (fitbitSaveErr) {
              return done(fitbitSaveErr);
            }

            // Update fitbit title
            fitbit.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing fitbit
            agent.put('/api/fitbits/' + fitbitSaveRes.body._id)
              .send(fitbit)
              .expect(200)
              .end(function (fitbitUpdateErr, fitbitUpdateRes) {
                // Handle fitbit update error
                if (fitbitUpdateErr) {
                  return done(fitbitUpdateErr);
                }

                // Set assertions
                (fitbitUpdateRes.body._id).should.equal(fitbitSaveRes.body._id);
                (fitbitUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an fitbit if no title is provided', function (done) {
    // Invalidate title field
    fitbit.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new fitbit
        agent.post('/api/fitbits')
          .send(fitbit)
          .expect(422)
          .end(function (fitbitSaveErr, fitbitSaveRes) {
            // Set message assertion
            (fitbitSaveRes.body.message).should.match('Title cannot be blank');

            // Handle fitbit save error
            done(fitbitSaveErr);
          });
      });
  });

  it('should be able to delete an fitbit if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new fitbit
        agent.post('/api/fitbits')
          .send(fitbit)
          .expect(200)
          .end(function (fitbitSaveErr, fitbitSaveRes) {
            // Handle fitbit save error
            if (fitbitSaveErr) {
              return done(fitbitSaveErr);
            }

            // Delete an existing fitbit
            agent.delete('/api/fitbits/' + fitbitSaveRes.body._id)
              .send(fitbit)
              .expect(200)
              .end(function (fitbitDeleteErr, fitbitDeleteRes) {
                // Handle fitbit error error
                if (fitbitDeleteErr) {
                  return done(fitbitDeleteErr);
                }

                // Set assertions
                (fitbitDeleteRes.body._id).should.equal(fitbitSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single fitbit if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new fitbit model instance
    fitbit.user = user;
    var fitbitObj = new FitBit(fitbit);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new fitbit
        agent.post('/api/fitbits')
          .send(fitbit)
          .expect(200)
          .end(function (fitbitSaveErr, fitbitSaveRes) {
            // Handle fitbit save error
            if (fitbitSaveErr) {
              return done(fitbitSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (fitbitInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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

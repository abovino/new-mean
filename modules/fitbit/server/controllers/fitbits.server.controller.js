'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  FitBit = mongoose.model('FitBit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an fitbit
 */
exports.create = function (req, res) {
  var fitbit = new FitBit(req.body);
  fitbit.user = req.user;

  fitbit.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fitbit);
    }
  });
};

/**
 * Show the current fitbit
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var fitbit = req.fitbit ? req.fitbit.toJSON() : {};

  // Add a custom field to the FitBit, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the FitBit model.
  fitbit.isCurrentUserOwner = !!(req.user && fitbit.user && fitbit.user._id.toString() === req.user._id.toString());

  res.json(fitbit);
};

/**
 * Update an fitbit
 */
exports.update = function (req, res) {
  var fitbit = req.fitbit;

  fitbit.title = req.body.title;
  fitbit.content = req.body.content;

  fitbit.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fitbit);
    }
  });
};

/**
 * Delete an fitbit
 */
exports.delete = function (req, res) {
  var fitbit = req.fitbit;

  fitbit.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fitbit);
    }
  });
};

/**
 * List of FitBits
 */
exports.list = function (req, res) {
  FitBit.find().sort('-created').populate('user', 'displayName').exec(function (err, fitbits) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fitbits);
    }
  });
};

/**
 * FitBit middleware
 */
exports.fitbitByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'FitBit is invalid'
    });
  }

  FitBit.findById(id).populate('user', 'displayName').exec(function (err, fitbit) {
    if (err) {
      return next(err);
    } else if (!fitbit) {
      return res.status(404).send({
        message: 'No fitbit with that identifier has been found'
      });
    }
    req.fitbit = fitbit;
    next();
  });
};

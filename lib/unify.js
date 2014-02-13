"use strict";

var _ = require("underscore");

function match(a,b) {
	var result = {};

	result.val = _.isEqual(a,b);
	result.vars = {};

	return result;
};

module.exports.match = match;
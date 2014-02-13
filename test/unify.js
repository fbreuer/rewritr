"use strict";

var _ = require("underscore");
var rewritr = require("../");
var chai = require("chai");

var assert = chai.assert;
var match = rewritr.unify.match;

describe("match", function() {
	describe("without variables", function() {
		it("matches equal arrays", function() {
			assert.deepEqual(
				match(["a", "b"], ["a", "b"]),
				{ val: true, vars: {} }
			);
		});
		it("does not match different arrays", function() {
			assert.deepEqual(
				match(["a", "b"], ["a", "b", "c"]),
				{ val: false, vars: {} }
			);
			assert.deepEqual(
				match(["a", "c", "b"], ["a", "b", "c"]),
				{ val: false, vars: {} }
			);
		});
		it("matches equal nested arrays", function() {
			assert.deepEqual(
				match(["a", ["b", "c"]], ["a", ["b", "c"]]),
				{ val: true, vars: {} }
			);
		});
		it("does not match different nested arrays", function() {
			assert.deepEqual(
				match(["a", ["c", "b"]], ["a", ["b", "c"]]),
				{ val: false, vars: {} }
			);
			assert.deepEqual(
				match(["a", {"b": "c"}], ["a", ["b", "c"]]),
				{ val: false, vars: {} }
			);
		});
	});
});
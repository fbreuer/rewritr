"use strict";

var _ = require("underscore");
var rewritr = require("../");
var chai = require("chai");

var assert = chai.assert;
var match = rewritr.unify.match;
var BFSWalker = rewritr.unify.BFSWalker;
var TermCursor = rewritr.unify.TermCursor;

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

	describe("with variables", function() {
		it("matches equal arrays", function() {
			// TODO
			assert.deepEqual(
				match(["a", "b"], ["a", "b"]),
				{ val: true, vars: {} }
			);
		});		
	});
});

describe("TermCursor", function() {
	describe("moveDown", function() {
		it("works without arguments", function() {
			var term = ["a", "b", "c"];
			var cursor = new TermCursor(term);
			assert.equal(cursor,cursor.moveDown());
			assert.equal(cursor.node,"a");
		});
		it("works with arguments", function() {
			var term = ["a", "b", "c"];
			var cursor = new TermCursor(term);
			assert.equal(cursor,cursor.moveDown(0));
			assert.equal(cursor.node,"a");
			cursor = new TermCursor(term);
			assert.equal(cursor,cursor.moveDown(1));
			assert.equal(cursor.node,"b");
			cursor = new TermCursor(term);
			assert.equal(cursor,cursor.moveDown(2));
			assert.equal(cursor.node,"c");
		});
		it("works at leaves", function() {
			var term = ["a", "b", "c"];
			var cursor = new TermCursor(term);
			assert.equal(cursor,cursor.moveDown(0));
			assert.equal(cursor.node,"a");
			assert.equal(cursor,cursor.moveDown());
			cursor._invariant();
		});
	});
});

describe("BFSWalker", function() {
	it("first example", function() {
		var term = ["a", ["b", ["c"]], ["d", "e", ["f", "g"]], "h", "i"];
		var walk = new BFSWalker(term);
		assert.isTrue(walk.hasNext());
		var cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term);
		assert.deepEqual(cursor.path, []);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[0]);
		assert.deepEqual(cursor.path, [0]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[1]);
		assert.deepEqual(cursor.path, [1]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[2]);
		assert.deepEqual(cursor.path, [2]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[3]);
		assert.deepEqual(cursor.path, [3]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[4]);
		assert.deepEqual(cursor.path, [4]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[1][0]);
		assert.deepEqual(cursor.path, [1,0]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[1][1]);
		assert.deepEqual(cursor.path, [1,1]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[2][0]);
		assert.deepEqual(cursor.path, [2,0]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[2][1]);
		assert.deepEqual(cursor.path, [2,1]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[2][2]);
		assert.deepEqual(cursor.path, [2,2]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[1][1][0]);
		assert.deepEqual(cursor.path, [1,1,0]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[2][2][0]);
		assert.deepEqual(cursor.path, [2,2,0]);
		assert.isTrue(walk.hasNext());
		cursor = walk.next();
		assert.isDefined(cursor);
		assert.equal(cursor.node, term[2][2][1]);
		assert.deepEqual(cursor.path, [2,2,1]);
		assert.isFalse(walk.hasNext());
		cursor = walk.next();
		assert.isNull(cursor);
	});
});
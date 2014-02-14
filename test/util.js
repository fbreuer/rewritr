"use strict";

var _ = require("underscore");
var rewritr = require("../");
var chai = require("chai");

var assert = chai.assert;
var Queue = rewritr.util.Queue;

describe("Queue", function() {
	it("example one", function() {
		var q = new Queue();
		assert.isTrue(q.isEmpty());
		assert.isUndefined(q.deq());
		q.enq("a");
		q.enq("b");
		assert.equal(q.deq(),"a");
		assert.equal(q.deq(),"b");
		assert.isTrue(q.isEmpty());
		assert.isUndefined(q.deq());
		q.enq("a");
		assert.isFalse(q.isEmpty());
		q.enq("b");
		q.enq("c");
		assert.equal(q.deq(),"a");
		assert.equal(q.deq(),"b");
		assert.isFalse(q.isEmpty());
		assert.equal(q.deq(),"c");
		assert.isTrue(q.isEmpty());
		assert.isUndefined(q.deq());
	});
});
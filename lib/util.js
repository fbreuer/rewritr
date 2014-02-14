"use strict";

var _ = require("underscore");

function Queue() {
	this.beginning = undefined;
	this.end = undefined;
};

Queue.prototype.enq = function(val) {
	var newnode = {v: val};
	if(_.isUndefined(this.beginning)) {
		this.beginning = newnode;
		this.end = newnode;
	} else {
		this.end.n = newnode;
		this.end = newnode;
	}
	return this;
};

Queue.prototype.deq = function() {
	if(this.isEmpty()) {
		return undefined;
	}
	var val = this.beginning.v;
	this.beginning = this.beginning.n;
	if(_.isUndefined(this.beginning)) {
		this.end = undefined;
	}
	return val;
};

Queue.prototype.isEmpty = function() {
	return _.isUndefined(this.beginning);
}

exports.Queue = Queue;
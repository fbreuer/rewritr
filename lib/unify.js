"use strict";

var _ = require("underscore");
var chai = require("chai");
var assert = chai.assert;
var util = require("./util");
var Queue = util.Queue;

function match(a,b) {
	var result = {};

	result.val = _.isEqual(a,b);
	result.vars = {};

	return result;
};

// Terms are immutable. Changing a term results in the creation of a new copy. All properties are read-only. Properties that need to be computed, are computed at construction time, even though this is of course inefficient.
// 


function Term(t) {
	this.t = t;
};


// TermCursors are mutable. They always refer to a fixed, immutable term.

function TermCursor(term) {
	this.term = term;
	this.node = term; // pointer to current node
	this.ancestors = [term]; // list of pointers to all ancestors of current node, including root and current node, starting with the root.
	this.path = []; // a list of integers, giving the index of the child we need to move to when decending the list of ancestors. the length of path is always one shorter than that of list.
};

TermCursor.prototype._invariant = function() {
  assert.isDefined(this.term);
  assert.isDefined(this.node);
  assert.isDefined(this.ancestors);
  assert.isDefined(this.path);
  assert.isTrue(this.ancestors.length == this.path.length + 1);
};

TermCursor.prototype._parent =  function() {
	if(this.path == []) {
		return null;
	}
	var n = this.ancestors.length; // know that this is at least 2
	var parent = this.ancestors[n-2];
	return parent;
};

TermCursor.prototype.children = function() {
	var result = [];
	if(this.isLeaf()) {
		return result;
	}
	var n = this.node.length;
	for(var i = 0; i < n; i++) {
		var cursor = this.clone();
		cursor.moveDown(i);
		result.push(cursor); 
	}
	return result;
};

// Checks is cursor is at the beginning of the parent node's children.

TermCursor.prototype.atBeginning = function() {
	if(this.path == []) {
		return true;
	}
	var i = _.last(this.path);
	return i == 0;
};

// Checks is cursor is at the end of the parent node's children.

TermCursor.prototype.atEnd = function() {
	if(this.path == []) {
		return true;
	}
	var parent = this._parent();
	var n_children = parent.length;
	var i = _.last(this.path);
	return i == n_children - 1;
};

TermCursor.prototype.moveLeft = function() {
	var n = this.path.length;
	var newpath = _.clone(this.path);
	var i = newpath[n-1];
	if(this.node.isInnerNode() && this._parent().length > i+1) {
		newpath[n-1] = i + 1;
		this.goTo(newpath);
	}
	return this;
};

TermCursor.prototype.moveRight = function() {
	var n = this.path.length;
	var newpath = _.clone(this.path);
	var i = newpath[n-1];
	if(this.node.isInnerNode() && i > 0) {
		newpath[n-1] = i - 1;
		this.goTo(newpath);
	}
	return this;
};

TermCursor.prototype.moveUp = function() {
	if(this.path != []) {
		this.goTo(_.initial(path));
	}
	return this;
};

TermCursor.prototype.moveDown = function(i) {
	if(this.isInnerNode()) {
		if(_.isUndefined(i)) {
			i = 0;
		}
		var newpath = _.clone(this.path);
		newpath.push(i);
		this.goTo(newpath);
	}
	return this;
};

TermCursor.prototype.goTo = function(path) {
	var node = this.term, ancestors = [];
	_.each(path, function(i) {
		ancestors.push(node);
		node = node[i]; // if this throws an error, the path is invalid.		
	});
	ancestors.push(node);
	this.node = node;
	this.ancestors = ancestors;
	this.path = path;
	return this;
};

TermCursor.prototype.isLeaf = function() {
	return _.isString(this.node);
};

TermCursor.prototype.isInnerNode = function() {
	return _.isArray(this.node);
};

TermCursor.prototype.isVariable = function() {
	return this.isLeaf() && node[0] == ":";
};

TermCursor.prototype.isRoot = function() {
	return this.node == this.term && this.path == [];
};

TermCursor.prototype.clone = function() {
	var clone = new TermCursor(this.term);
	clone.node = this.node;
	clone.ancestors = _.clone(this.ancestors);
	clone.path = _.clone(this.path);
	return clone;
};

function BFSWalker(term) {
	//this.visited = []; // we would only need to keep track of visited node, if we were searching on a graph. on a tree this is unnecessary.
	this.queue = new Queue();
	this.queue.enq(new TermCursor(term));
};

BFSWalker.prototype.hasNext = function() {
	return !this.queue.isEmpty();
};

BFSWalker.prototype.next = function() {
	if(!this.hasNext()) {
		return null;
	}
	var current = this.queue.deq();
	var children = current.children();
	for(var i = 0; i < children.length; i++) {
		this.queue.enq(children[i]);			
	}
	return current;
};

module.exports.match = match;
module.exports.TermCursor = TermCursor;
module.exports.BFSWalker = BFSWalker;
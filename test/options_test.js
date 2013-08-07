var Fabricate = require('../lib/fabricate');

exports.module = {
  testErrorWhenNoOptionsPassed: function(test) {
    function newFab(opts) {
      return function() { new Fabricate(opts); }
    }
    test.throws(newFab(), 'Options object must be defined', 'missing options error thrown');
    test.throws(newFab(false), 'Options object must be defined', 'missing options error thrown');
    test.throws(newFab(true), 'Options object must be defined', 'missing options error thrown');
    test.throws(newFab([]), 'Options object must be defined', 'missing options error thrown');
    test.throws(newFab(''), 'Options object must be defined', 'missing options error thrown');
    test.throws(newFab(1), 'Options object must be defined', 'missing options error thrown');
    test.done();
  },

  testSrcOptionIsRequired: function(test) {
    function newFab() {
      new Fabricate({ dest: '' });
    }
    test.throws(newFab, 'src option is required', 'error thown for missing src option');
    test.done();
  },

  testDestOptionIsRequired: function(test) {
    function newFab() {
      new Fabricate({ src: '' });
    }
    test.throws(newFab, 'src option is required', 'error thown for missing src option');
    test.done();
  }
};
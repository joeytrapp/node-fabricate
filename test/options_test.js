var Fabricate = require('../lib/fabricate'),
    path = require('path');

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
    test.throws(newFab, 'dest option is required', 'error thown for missing dest option');
    test.done();
  },

  testSetsUpOptionsOnCreate: function(test) {
    var fab = new Fabricate({ src: 'test/data/src/app.js', dest: 'test/data/dest/app.js' });
    test.equal(fab.src, 'app.js', 'src option is set');
    test.notEqual(fab.include.indexOf('test/data/src'), -1, 'src dirname added to include');
    test.equal(fab.dest, 'test/data/dest/app.js', 'dest option is set');
    test.equal(fab.sourceMap, 'app.js.map', 'sourceMap option gets a default value');
    test.equal(fab.tmpDir, 'tmp', 'tmpDir option gets a default value');
    test.equal(fab.compress, false, 'compress option gets set to false by default');
    test.done();
  },

  testSettingSourceMapToFalseDisablesDefaultValue: function(test) {
    var fab = new Fabricate({
      src: 'test/data/src/app.js',
      dest: 'test/data/dest/app.js',
      sourceMap: false
    });
    test.equal(fab.sourceMap, false, 'sourceMap is not default when passed false');
    test.done();
  },
};
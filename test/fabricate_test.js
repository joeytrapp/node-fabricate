var Fabricate = require('../lib/fabricate'),
    path = require('path'),
    fs = require('fs'),
    exec = require('child_process').exec,
    src = path.join(process.cwd(), 'test', 'data', 'src', 'app.js'),
    dest = path.join(process.cwd(), 'test', 'data', 'dest', 'app.js'),
    clearAssets;

exports.module = {
  tearDown: function(ready) {
    exec(
      ['rm', 'data/dest/*'].join(' '),
      { cwd: path.join(process.cwd(), 'test') },
      function(err, stdout, stderr) {
        if (err) {
          throw new Error(err);
        }
        ready();
      }
    );
  },

  testBuildsAssets: function(test) {
    new Fabricate({
      src:  src,
      dest: dest,
    }).build(function(err) {
      test.equal(err, null);
      test.ok(fs.readFileSync(dest).length);
      test.done();
    });
  },

  testBuiltAssetIncludesExpectedFileContents: function(test) {
    new Fabricate({
      src:  src,
      dest: dest,
    }).build(function(err) {
      var content = fs.readFileSync(dest);
      test.ok(/var App=\{\};/.test(content));
      test.ok(/App\.lib1=function\(\)\{\};/.test(content));
      test.ok(/App\.lib2=function\(\)\{\};/.test(content));
      test.ok(/\/\/\@ sourceMappingURL=app\.js\.map/.test(content));
      test.ok(fs.existsSync(path.join(path.dirname(dest), 'app.js.map')));
      test.done();
    });
  },

  testBuiltAssetDoesNotIncludeMapWhenSourceMapFalse: function(test) {
    new Fabricate({
      src:  src,
      dest: dest,
      sourceMap: false
    }).build(function(err) {
      var content = fs.readFileSync(dest);
      test.ok(/var App=\{\};/.test(content));
      test.ok(/App\.lib1=function\(\)\{\};/.test(content));
      test.ok(/App\.lib2=function\(\)\{\};/.test(content));
      test.ok(!/\/\/\@ sourceMappingURL=app\.js\.map/.test(content));
      test.ok(!fs.exists(path.join(path.dirname(dest), 'app.js.min')));
      test.done();
    });
  },
};

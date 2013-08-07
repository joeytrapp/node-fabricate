var Fabricate = require('../index.js');

exports.module = {
  testModuleReturnsFabricateConstructor: function(test) {
    test.ok(typeof Fabricate === 'function', 'AssetsPath method exists');
    test.done();
  }
};

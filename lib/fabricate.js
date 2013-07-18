var Mincer = require('mincer'),
    Uglify = require('uglify-js'),
    path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    _ = require('underscore');

function buildForAsset(asset, srcDir, destDir, loadOrder) {
  var isTopLevel = false,
      requiredAssets = asset.requiredAssets || [];

  if (!_.isArray(loadOrder)) {
    loadOrder = [];
    isTopLevel = true;
  }

  requiredAssets.forEach(function(reqAsset){
    var targetPathname;
    if (loadOrder.indexOf(reqAsset.pathname) !== -1) { return; }
    if (reqAsset.pathname === asset.pathname) {
      targetPathname = path.join(destDir, path.relative(path.dirname(srcDir), asset.pathname));
      targetPathname = normalizeExtensions(targetPathname);
      mkdirp.sync(path.dirname(targetPathname));
      fs.writeFileSync(targetPathname, asset.source);
      loadOrder.push(targetPathname);
    } else {
      buildForAsset(reqAsset, srcDir, destDir, loadOrder);
    }
  });

  if (isTopLevel) return loadOrder;
}

function normalizeExtensions(pathname) {
  return pathname.replace(".css.less",".css")
                 .replace(".css.scss",".css")
                 .replace(".css.styl",".css")
                 .replace(".less",".css")
                 .replace(".scss",".css")
                 .replace(".styl",".css")
                 .replace(".js.coffee",".js")
                 .replace(".coffee",".js");
}

var Fabricate = module.exports = function Fabricate(options) {
  this.src       = options.src;
  this.dest      = options.dest;
  this.include   = options.include;
  this.sourceMap = options.sourceMap === undefined ? path.basename(this.src) + '.map' : options.sourceMap;
  this.tmpDir    = options.tmpDir || 'tmp';
  this.compress  = options.compress || false;
};

Fabricate.prototype.build = function(callback) {
  this.minceAssets(callback);
};

Fabricate.prototype.minceAssets = function(callback) {
  var asset, environment;

  environment = new Mincer.Environment(process.cwd());

  this.include.forEach(function(include) {
    environment.appendPath(include);
  });

  asset = environment.findAsset(this.src, { bundle: false });

  if (!asset) {
    return callback('Cannot find logical path: ' + this.src);
  }

  asset.compile(function(err, asset) {
    var loadOrder;
    if (err) {
      callback(err);
    } else {
      loadOrder = _.uniq(buildForAsset(asset, path.dirname(asset.pathname), this.tmpDir));
      this.uglifyAssets(loadOrder, callback);
    }
  }.bind(this));
};

Fabricate.prototype.uglifyAssets = function(loadOrder, callback) {
  var result, code, map,
      options = {
        outSourceMap: this.sourceMap,
        compress: false,
        mangle: false
      };

  if (this.compress) {
    options = _.extend({}, options, {
      compress: {},
      mangle: true
    });
  }

  if (!this.sourceMap) delete options.outSourceMap;

  result = Uglify.minify(loadOrder, options);
  code = result.code;
  if (this.sourceMap) {
    map = JSON.parse(result.map);
    map.sources = map.sources.map(function(source) {
      return source.replace(this.tmpDir, '');
    }.bind(this));
    fs.writeFileSync(path.join(path.dirname(this.dest), this.sourceMap), JSON.stringify(map));
    // code += "\n//# sourceMappingUrl="+this.sourceMap;
    code += "\n//@ sourceMappingURL="+this.sourceMap;
  }
  fs.writeFileSync(this.dest, code);
  callback(null);
};


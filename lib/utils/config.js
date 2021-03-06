// Generated by CoffeeScript 1.6.3
var abs_location, argv, config, debug, dirpath, dirs, error, fs, index, info, location, name, path, root, tmp, util, warn, yml, _base, _i, _len, _ref, _ref1, _ref2;

path = require('path');

fs = require('fs');

util = require('util');

require('js-yaml');

dirs = require('./dirs');

argv = require('../cli').argv;

_ref = require('./logger')('utils/config'), error = _ref.error, warn = _ref.warn, info = _ref.info, debug = _ref.debug;

if (dirs.pwd != null) {
  if (argv['config-file'] != null) {
    yml = path.join(dirs.pwd, argv['config-file']);
  } else {
    yml = path.join(dirs.pwd, "polvo.yml");
  }
}

if (!fs.existsSync(yml)) {
  error('Config file not found ~>', yml);
  return null;
}

if (fs.statSync(yml).isDirectory()) {
  error('Config file\'s path is a directory  ~>', yml);
  return null;
} else {
  config = require(yml) || {};
  delete require.cache[require.resolve(yml)];
}

if (argv.server) {
  if (config.server != null) {
    if ((_base = config.server).port == null) {
      _base.port = 3000;
    }
    if (config.server.root) {
      root = config.server.root = path.join(dirs.pwd, config.server.root);
      if (!fs.existsSync(root)) {
        error('Server\'s root dir does not exist ~>', root);
        return null;
      }
    } else {
      error('Server\'s root not set in in config file');
      return null;
    }
  } else {
    error('Server\'s config not set in config file');
    return null;
  }
}

if ((config.input != null) && config.input.length) {
  _ref1 = config.input;
  for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
    dirpath = _ref1[index];
    tmp = config.input[index] = path.join(dirs.pwd, dirpath);
    if (!fs.existsSync(tmp)) {
      error('Input dir does not exist ~>', dirs.relative(tmp));
      return null;
    }
  }
} else {
  error('You need at least one input dir in config file');
  return null;
}

if (config.output != null) {
  if (config.output.js != null) {
    config.output.js = path.join(dirs.pwd, config.output.js);
    tmp = path.dirname(config.output.js);
    if (!fs.existsSync(tmp)) {
      error('JS\'s output dir does not exist ~>', dirs.relative(tmp));
      return null;
    }
  }
  if (config.output.css != null) {
    config.output.css = path.join(dirs.pwd, config.output.css);
    tmp = path.dirname(config.output.css);
    if (!fs.existsSync(tmp)) {
      error('CSS\'s output dir does not exist ~>', dirs.relative(tmp));
      return null;
    }
  }
} else {
  error('You need at least one output in config file');
  return null;
}

if (config.alias != null) {
  _ref2 = config.alias;
  for (name in _ref2) {
    location = _ref2[name];
    abs_location = path.join(dirs.pwd, location);
    if (!fs.existsSync(abs_location)) {
      error("Alias '" + name + "' does not exist ~>", location);
      return null;
    } else {
      config.alias[name] = dirs.relative(abs_location);
    }
  }
}

if (config.minify == null) {
  config.minify = {};
}

if (config.minify.js == null) {
  config.minify.js = true;
}

if (config.minify.css == null) {
  config.minify.css = true;
}

if (config.boot == null) {
  error("Boot module not informed in config file");
  return null;
} else {
  config.boot = path.join(dirs.pwd, config.boot);
  config.boot = dirs.relative(config.boot);
}

module.exports = config;

/*
//@ sourceMappingURL=config.map
*/

// Generated by CoffeeScript 1.6.3
(function() {
  var Cli, colors, optimist, version;

  optimist = require('optimist');

  version = require('./utils/version');

  colors = require('colors');

  module.exports = Cli = (function() {
    var examples, optimis, usage;

    Cli.prototype.argv = null;

    Cli.prototype.options = null;

    optimis = null;

    usage = null;

    examples = null;

    function Cli(options) {
      this.options = options;
      this.configure();
      this.init();
      this.argv = optimis.argv;
    }

    Cli.prototype.configure = function() {
      usage = "Polvo " + ('v' + version).grey + "\n" + 'Polyvalent cephalopod mollusc'.grey + "\n\n" + 'Usage:' + "\n  polvo [" + 'options'.green + "] [" + 'params'.green + "]";
      return examples = "Examples:\n  polvo -ws\n  polvo -ws -b ./your/app/folder -j ./your/app/folder/config.polvo";
    };

    Cli.prototype.help = function() {
      return "" + (optimis.help()) + "\n" + examples;
    };

    Cli.prototype.init = function() {
      var inject, key, val, _ref;
      inject = [];
      _ref = this.options;
      for (key in _ref) {
        val = _ref[key];
        if (key.length === 1) {
          inject = inject.concat("-" + key, val);
        } else {
          inject = inject.concat("--" + key, val);
        }
      }
      return optimis = optimist(process.argv.concat(inject)).usage(usage).alias('w', 'watch').describe('w', "Start watching/compiling in dev mode").alias('c', 'compile').describe('c', "Compile project in development mode").alias('r', 'release').describe('r', "Compile project in release mode").alias('s', 'server').describe('s', "Serves project statically, options in config file").alias('j', 'config').string('j').describe('j', "Config file formatted as a json-string").alias('f', 'config-file').string('f').describe('f', "Path to a different config file").alias('v', 'version').describe('v', 'Show Polvo\'s version').alias('h', 'help').describe('h', 'Shows this help screen');
    };

    return Cli;

  })();

}).call(this);

/*
//@ sourceMappingURL=cli.map
*/
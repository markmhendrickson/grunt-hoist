/**
 * Grunt task to deploy local dependencies in parent package
 * @module
 */

'use strict';

var fs = require('fs');
var Path = require('path');

module.exports = function(grunt) {
  grunt.registerTask('hoist-deploy-local-dependencies', 'Deploy local dependencies in parent package', function() {
    var path = Path.resolve(__dirname, '../../../package.json'),
        parentPackage = require(path);

    if (!parentPackage.dependencies) {
      return;
    }

    Object.keys(parentPackage.dependencies).forEach((key) => {
      var dependency = parentPackage.dependencies[key];

      if (dependency.indexOf('file:../') === 0) {
        var src = Path.resolve(path, '../', dependency.substr(5));
        var dest = '../' + src.split('/').pop();

        grunt.log.write('Deploying local dependency from %s to %s', src, dest);

        var config = `hoist-deploy-files.local-dependency-${key}`;
        grunt.config.set(`${config}.src`, src);
        grunt.config.set(`${config}.dest`, dest);

        grunt.task.run(`hoist-deploy-files:local-dependency-${key}`);
      }
    });
  });
};
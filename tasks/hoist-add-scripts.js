/**
 * Grunt task to add convenience scripts to parent package config file
 * @module
 */

'use strict';

var fs = require('fs');
var Path = require('path');

module.exports = function(grunt) {
  grunt.registerTask('hoist-add-scripts', 'Add convenience scripts to parent package config file', function() {
    var path = Path.resolve(__dirname, '../../../package.json'),
        parentPackage = require(path);

    parentPackage.scripts = parentPackage.scripts ? parentPackage.scripts : {};

    Object.assign(parentPackage.scripts, {
      'deploy-all': 'grunt hoist-deploy-all',
      'deploy-app': 'grunt hoist-deploy-app',
      'deploy-dependencies': 'grunt hoist-deploy-dependencies'
    });

    fs.writeFileSync(path, JSON.stringify(parentPackage, null, 2));
  });
};
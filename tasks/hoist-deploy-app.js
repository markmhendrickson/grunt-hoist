/**
 * Grunt task to deploy app to host and execute remote procedures.
 * @module
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerTask('hoist-deploy-app', 'Deploy app to host and execute remote procedures.', function() {
    [ 'app',
      'Gruntfile.js',
      'index.js',
      'package.json'
    ].forEach((filename, i) => {
      var config = `hoist-deploy-files.app-${i}`;
      grunt.config.set(`${config}.src`, filename);
      grunt.config.set(`${config}.dest`, undefined);
      grunt.task.run(`hoist-deploy-files:app-${i}`);
    });

    grunt.task.run('hoist-deploy-local-dependencies');
    grunt.task.run('hoist-install-dependencies');
    grunt.task.run('hoist-restart-systemd');
  });
};
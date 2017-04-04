/**
 * Grunt task to install dependencies on host
 * @module
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerTask('hoist-install-dependencies', 'Install dependencies on host.', function() {
    grunt.config.set('hoist-execute-remotely.install-dependencies.command', 'npm install --production');
    grunt.task.run('hoist-execute-remotely:install-dependencies');
  });
};
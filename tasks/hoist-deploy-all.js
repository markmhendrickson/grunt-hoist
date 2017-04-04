/**
 * Grunt task to deploy dependencies and app to host and execute remote procedures.
 * @module
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerTask('hoist-deploy-all', 'Deploy dependencies and app to host and execute remote procedures.', function() {
    grunt.task.run('hoist-deploy-dependencies');
    grunt.task.run('hoist-deploy-app');
  });
};
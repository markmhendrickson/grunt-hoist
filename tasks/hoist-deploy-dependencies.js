/**
 * Grunt task to deploy dependencies to host
 * @module
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerTask('hoist-deploy-dependencies', 'Deploy dependencies to host.', function() {
    grunt.task.run('hoist-deploy-suffixed-files:.certs');
    grunt.task.run('hoist-deploy-suffixed-files:.config:json');
    grunt.task.run('hoist-deploy-suffixed-files:.env');
  });
};
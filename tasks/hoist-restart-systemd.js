/**
 * Grunt task to start or restart systemd service on host
 * @module
 */

'use strict';

var envOptions = require('../env-options');

module.exports = function(grunt) {
  grunt.registerTask('hoist-restart-systemd', 'Start or restart systemd service on host.', function() {
    var options = envOptions;

    if (!options.systemdService) {
      return grunt.log.write('No systemdService value with which to start or restart');
    }

    grunt.config.set('hoist-execute-remotely.restart-systemd.command', `sudo systemctl restart ${options.systemdService} || sudo systemctl start ${options.systemdService}`);
    grunt.task.run('hoist-execute-remotely:restart-systemd');
  });
};
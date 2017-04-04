/**
 * Grunt task to execute command remotely on host
 * @module
 */

'use strict';

var envOptions = require('../env-options');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-ssh');

  grunt.registerMultiTask('hoist-execute-remotely', 'Execute command remotely on host.', function() {
    var options = Object.assign(envOptions, grunt.config.get('hoist-execute-remotely').options, this.data);

    if (!options.command) {
      throw new Error('No command provided to execute remotely');
    }

    grunt.config.set('sshexec.execute-remotely.options.agent', process.env.SSH_AUTH_SOCK);
    grunt.config.set('sshexec.execute-remotely.options.host', options.destHost);
    grunt.config.set('sshexec.execute-remotely.options.username', options.destUser);
    grunt.config.set('sshexec.execute-remotely.command', 'cd ' + options.destDir + ' && ' + options.command);
    grunt.task.run('sshexec:execute-remotely');
  });
};
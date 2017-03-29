/**
 * Grunt task to deploy files to remote host
 * @module
 */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-rsync');

  /**
   * Deploy file or directory (if it exists) to host directory
   * If file is package.json, run `npm install` remotely on host
   * @param {string} [args] – rsync arguments
   */
  grunt.registerMultiTask('deploy-files', 'Deploy file or directory (if it exists) to host directory', function() {
    var options = Object.assign({}, grunt.config.get('deploy-files').options, this.data);

    if (!options.src) { throw new Error('No src configured'); }
    if (!options.destHost) { throw new Error('No destHost configured'); }
    if (!options.destDir) { throw new Error('No destDir configured'); }
    if (!options.srcDir) { throw new Error('No srcDir configured'); }

    // Resolve relative path to source to absolute
    var srcPath = path.resolve(options.srcDir, options.src);

    if (!grunt.file.exists(srcPath)) { throw new Error(`File or directory does not exist: ${srcPath}`); }

    // Ensure deployment host directory exists and prepend custom arguments
    var args = options.args ? options.args : '';
    args = `${args} --rsync-path="mkdir -p ${options.destDir} && rsync"`;

    // Use same path for destination as source if not declared
    var dest = options.dest ? options.dest : options.src;

    // Resolve relative path to dest to absolute
    var destPath = path.resolve(options.destDir, dest);

    if (fs.lstatSync(srcPath).isDirectory()) {
      srcPath = srcPath + '/';
      destPath = destPath + '/';
    }

    grunt.config.set('rsync.deployFiles.options.host', options.destUser + '@' + options.destHost);
    grunt.config.set('rsync.deployFiles.options.recursive', true);
    grunt.config.set('rsync.deployFiles.options.args', [args]);
    grunt.config.set('rsync.deployFiles.options.src', srcPath);
    grunt.config.set('rsync.deployFiles.options.dest', destPath);

    grunt.task.run('rsync:deployFiles');

    var commands = [];

    if (options.src === 'package.json') {
      grunt.log.write('Preparing to execute "npm install --production" on host');
      commands.push('cd ' + options.destDir + ' && npm install --production');
    }

    if (options.systemdService) {
      grunt.log.write(`Preparing to restart or start systemd service "${options.systemdService}" on host`);
      commands.push(`sudo systemctl restart ${options.systemdService} || sudo systemctl start ${options.systemdService}`);
    }

    if (commands.length) {
      grunt.config.set('sshexec.deployFiles.options.agent', process.env.SSH_AUTH_SOCK);
      grunt.config.set('sshexec.deployFiles.options.host', options.destHost);
      grunt.config.set('sshexec.deployFiles.options.username', options.destUser);

      commands.forEach((command) => {
        grunt.config.set('sshexec.deployFiles.command', command);
        grunt.task.run('sshexec:deployFiles');
      });
    }
  });
};
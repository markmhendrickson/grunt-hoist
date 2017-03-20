/**
 * Grunt task to deploy files to remote host
 * @module
 */

'use strict';

var fs = require('fs');
var loadGruntTasks = require('load-grunt-tasks');
var path = require('path');

module.exports = function(grunt) {
  loadGruntTasks(grunt);

  /**
   * Deploy file or directory (if it exists) to host directory
   * @param {string} srcRel - Path for source of file or directory relative to local repository directory
   * @param {string} [destRel] - Path for destination of file or directory relative to deployment host directory. Defaults to same value as src.
   * @param {string} [args] – rsync arguments
   */
  grunt.registerTask('deploy-files', 'Deploy file or directory (if it exists) to host directory', function(srcRel, destRel, args) {
    var options = grunt.config.deployFiles[this.target] ? grunt.config.deployFiles[this.target].options : grunt.config.deployFiles.options;
    var srcAbs = path.resolve(process.env.SYNC_SERVER_DIR, srcRel);
    var host = options.host;
    var hostDir = options.dir;

    if (!host) { throw new Error('No host configured'); }
    if (!hostDir) { throw new Error('No host directory configured'); }

    if (!grunt.file.exists(srcAbs)) { return grunt.log.writeln('File or directory does not exist: %s', srcAbs); }

    // Ensure deployment host directory exists and prepend custom arguments
    args = args ? args : '';
    args = `${args} --rsync-path="mkdir -p ${hostDir} && rsync"`;

    // Use same path for destination as source if not declared
    destRel = destRel ? destRel : srcRel;

    // Resolve relative path to dest to absolute
    var destAbs = path.resolve(hostDir, destRel);

    if (fs.lstatSync(srcAbs).isDirectory()) {
      srcAbs = srcAbs + '/';
      destAbs = destAbs + '/';
    }

    grunt.config.set('rsync.deployFiles.options.host', host);
    grunt.config.set('rsync.deployFiles.options.recursive', true);
    grunt.config.set('rsync.deployFiles.options.args', [args]);
    grunt.config.set('rsync.deployFiles.options.src', srcAbs);
    grunt.config.set('rsync.deployFiles.options.dest', destAbs);

    grunt.task.run('rsync:deployFiles');
  });
};
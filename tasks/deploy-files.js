/**
 * Grunt task to deploy files to remote host
 * @module
 */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-rsync');

  /**
   * Deploy file or directory (if it exists) to host directory
   * @param {string} srcRelPath - Path for source of file or directory relative to local repository directory
   * @param {string} [destRelPath] - Path for destination of file or directory relative to deployment host directory. Defaults to same value as src.
   * @param {string} [args] – rsync arguments
   */
  grunt.registerTask('deploy-files', 'Deploy file or directory (if it exists) to host directory', function(srcRelPath, destRelPath, args) {
    if (!srcRelPath) { throw new Error('No srcRelPath parameter provided'); }

    var config = grunt.config.get('deployFiles');

    if (!config) { throw new Error('No deployFiles configuration found'); }

    var options = this.target && config[this.target] ? config[this.target].options : config.options;

    if (!options.destHost) { throw new Error('No destHost configured'); }
    if (!options.destDir) { throw new Error('No destination directory path configured'); }
    if (!options.srcDir) { throw new Error('No source directory path configured'); }

    var srcPath = path.resolve(options.srcDir, srcRelPath);

    if (!grunt.file.exists(srcPath)) { throw new Error(`File or directory does not exist: ${srcPath}`); }

    // Ensure deployment host directory exists and prepend custom arguments
    args = args ? args : '';
    args = `${args} --rsync-path="mkdir -p ${options.destDir} && rsync"`;

    // Use same path for destination as source if not declared
    destRelPath = destRelPath ? destRelPath : srcRelPath;

    // Resolve relative path to dest to absolute
    var destPath = path.resolve(options.destDir, destRelPath);

    if (fs.lstatSync(srcPath).isDirectory()) {
      srcPath = srcPath + '/';
      destPath = destPath + '/';
    }

    grunt.config.set('rsync.deployFiles.options.host', options.destHost);
    grunt.config.set('rsync.deployFiles.options.recursive', true);
    grunt.config.set('rsync.deployFiles.options.args', [args]);
    grunt.config.set('rsync.deployFiles.options.src', srcPath);
    grunt.config.set('rsync.deployFiles.options.dest', destPath);

    grunt.task.run('rsync:deployFiles');
  });
};
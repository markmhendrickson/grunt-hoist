/**
 * Grunt task to deploy files to remote host
 * @module
 */

'use strict';

var envOptions = require('../env-options');
var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-rsync');

  /**
   * Deploy file or directory (if it exists) to host directory
   * If file is package.json, run `npm install` remotely on host
   */
  grunt.registerMultiTask('hoist-deploy-files', 'Deploy file or directory (if it exists) to host directory', function() {
    var options = Object.assign(envOptions, grunt.config.get('hoist-deploy-files').options, this.data);

    if (!options.src) {
      grunt.log.write(`No src configured for target: ${this.target}`); 
      return;
    }

    if (!options.destHost) { throw new Error('No destHost configured'); }
    if (!options.destDir) { throw new Error('No destDir configured'); }

    if (!options.srcDir) {
      options.srcDir = path.resolve(__dirname, '../../../');
    } 

    // Resolve relative path to source to absolute
    var srcPath = path.resolve(options.srcDir, options.src);

    if (!grunt.file.exists(srcPath)) { 
      grunt.log.write(`File or directory does not exist: ${srcPath}`); 
      return;
    }

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
  });
};
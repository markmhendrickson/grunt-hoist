/**
 * Grunt task to deploy files suffixed with environment (if available) to host.
 * @module
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerTask('hoist-deploy-suffixed-files', 'Deploy files suffixed with environment (if available) to host.', function(src, extension) {
    if (!src) {
      throw new Error('No src provided');
    }

    var dest = process.env.ENV_NAME ? `${src}-${process.env.ENV_NAME}` : src;
    var src = process.env.ENV_NAME ? `${src}-${process.env.ENV_NAME}-deploy` : '${src}-deploy';

    if (extension) {
      src = src + '.' + extension;
      dest = dest + '.' + extension;
    }

    grunt.config.set('hoist-deploy-files.suffixed.src', src);
    grunt.config.set('hoist-deploy-files.suffixed.dest', dest);
    
    grunt.task.run('hoist-deploy-files:suffixed');
  });
};
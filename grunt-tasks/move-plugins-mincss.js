var fs = require('fs-extra');
var path = require('path');

var Utils = require('./utilities/task-utilities');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..');

module.exports = function(grunt) {
   grunt.registerMultiTask('move-plugins-mincss', 'moves minified css files into the plugins directories', function() {
      var done = this.async();

      var src = this.data.srcFolder;
      var target = this.data.targetFolder;

      // get the plugin to compile
      var pluginFolders = Utils.getFolders(path.join(ROOT, src));
      pluginFolders.forEach(function(pluginFolder) {
         moveCssMin(pluginFolder, target);
      });

      done();
      return;
   });

   function moveCssMin(pluginFolder, targetFolder) {
      var cssFileName = pluginFolder.concat('.min.css');
      var src = path.join(ROOT, targetFolder, cssFileName);
      var dest = path.join(ROOT, targetFolder, pluginFolder, cssFileName);

      moveSync(src, dest);
   }

   function moveSync(oldPath, newPath, opts) {
      var err;
      try {
         fs.renameSync(oldPath, newPath);
      }
      catch (err) {
         if (err) {
            if (err.code === 'EXDEV') {
               // copy and unlink
               fs.copySync(oldPath, newPath, function(err, cache) {
                  if (err && !Array.isArray(err)) {
                     throw err;
                  }
                  else {
                     fse.rmdirsSync(oldPath);
                  }
               }, opts);
            }
            else {
               throw err;
            }
         }
      };
   };
};
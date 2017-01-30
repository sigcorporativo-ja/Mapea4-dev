var async = require('async');

var path = require('path');
var fs = require('fs-extra');
var hbs = require('handlebars');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..');

module.exports = function(grunt) {

   grunt.registerMultiTask('plugin-archetype', 'copy archetype to the src folder', function() {
      var done = this.async();

      // plugin options
      var pluginOpts = grunt.option('plugin-options');
      var name = pluginOpts.name;
      var id = name.toLowerCase();
      var type = pluginOpts.type;
      var panel = pluginOpts.panel;

      // copy archetype
      var srcDir = path.join(ROOT, 'archetype');
      var destDir = path.join(ROOT, 'src', id);
      fs.ensureDirSync(destDir);
      fs.copySync(srcDir, destDir);

      var files = [
         // facade/assets/css/archetype.css
         path.join(destDir, 'facade', 'assets', 'css', 'archetype.css'),
         // facade/js/archetype.js
         path.join(destDir, 'facade', 'js', 'archetype.js'),
         // facade/js/archetypeControl.js
         path.join(destDir, 'facade', 'js', 'archetypeControl.js'),
         // impl/ol3/js/archetypeControl.js
         path.join(destDir, 'impl', 'ol3', 'js', 'archetypeControl.js'),
         // templates/archetype.html
         path.join(destDir, 'templates', 'archetype.html')
      ];
      replaceContent(files, name, id);
      rename(files, id);
      done();
   });

   /**
    * Replace the content of the files by the name and id specified
    * by the user. Vars are {{archetype.plugin.name}} and
    * {{archetype.plugin.id}}
    */
   function replaceContent(files, name, id) {
      var hbsVar = {
         'archetype': {
            'plugin': {
               'name': name,
               'id': id
            }
         }
      };
      files.forEach(function(file) {
         // replaced content
         var newContent = hbs.compile(fs.readFileSync(file, {
            encoding: 'utf-8'
         }))(hbsVar);
         fs.outputFileSync(file, newContent);
      });
   }

   /**
    * Rename the files archetype by the plugin id specified
    * by the user
    */
   function rename(files, name) {
      var regExp = /archetype([^\\]*\.\w+)$/;
      var newNameRegExp = name + '$1';
      files.forEach(function(file) {
         fs.renameSync(file, file.replace(regExp, newNameRegExp));
      });
   }
};
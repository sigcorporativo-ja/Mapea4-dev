var async = require('async');

var path = require('path');
var fs = require('fs-extra');
var hbs = require('handlebars');

var Utils = require('./utilities/task-utilities');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..');

module.exports = function(grunt) {

   grunt.registerMultiTask('compile-templates', 'get content templates and it stores into js vars', function() {
      var done = this.async();

      var src = this.data.srcFolder;
      var target = this.data.targetFolder;
      var templateOutputFileName = hbs.compile(this.data.templateOutputFileName);
      var templateRequireFileName = hbs.compile(this.data.templateRequireFileName);
      var templateNamespace = hbs.compile(this.data.templateNamespace);
      var templateAddingMethod = hbs.compile(this.data.templateAddingMethod);

      // iterates over the plugins and gets their html template files
      // then it compiles with Handlebars the adding method and puts it
      // into the template vars file
      Utils.getFolders(path.join(ROOT, src)).forEach(function(pluginFolder) {
         console.log('      · Compiling templates for: ' + pluginFolder);
         var templatesJs = path.join(ROOT, target, templateOutputFileName({
            'plugin': pluginFolder
         }));
         var requireTemplatesJs = path.join(ROOT, target, templateRequireFileName({
            'plugin': pluginFolder
         }));
         var namespace = templateNamespace({
            'plugin': pluginFolder
         });

         // adds require directive: goog.require('P.templates.plugin');
         fs.appendFileSync(requireTemplatesJs, "goog.require('" + namespace + "');", {
            encoding: 'utf-8'
         });
         // adds provide directive: goog.provide('P.templates.plugin');
         fs.appendFileSync(templatesJs, "goog.provide('" + namespace + "');", {
            encoding: 'utf-8'
         });
         // opens closure function to the file
         fs.appendFileSync(templatesJs, "(function(M) {", {
            encoding: 'utf-8'
         });
         var templatesFolder = path.join(ROOT, src, pluginFolder, 'templates');
         Utils.getHtmlFiles(templatesFolder).forEach(function(template) {
            var templateFile = path.join(templatesFolder, template);
            var templateFn = hbs.precompile(fs.readFileSync(templateFile, {
               encoding: 'utf-8'
            }));
            var addingSentence = templateAddingMethod({
               'name': path.basename(templateFile),
               'fn': templateFn.toString()
            });
            fs.appendFileSync(templatesJs, addingSentence, {
               encoding: 'utf-8'
            });
            fs.appendFileSync(templatesJs, '\r\n', {
               encoding: 'utf-8'
            });
         });
         // closes closure function to the file
         fs.appendFileSync(templatesJs, "})(window.M);", {
            encoding: 'utf-8'
         });
      });
      grunt.log.ok('Templates compilation succeed');
      done();
      return;
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
};
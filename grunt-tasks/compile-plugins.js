var fs = require('fs-extra');
var path = require('path');
var hbs = require('handlebars');

var Utils = require('./utilities/task-utilities');
var compile = require('./utilities/mapea-compiler');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..');

module.exports = function(grunt) {
   grunt.registerMultiTask('compile-plugins', 'use closure to build the project', function() {
      var done = this.async();

      var dir = this.data.dir;
      var exportsDir = this.data.exportsDir;
      var outputDir = this.data.outputDir;
      var closureComplileOpts = this.data.closureComplileOpts;
      var templatesDir = this.data.templatesDir;
      var requireTemplatesFile = this.data.requireTemplatesFile;

      // get the plugin to compile
      var pluginFolders = [];
      var pluginToCompile = grunt.option('name');
      if ((pluginToCompile == null) || (pluginToCompile === '*')) {
         pluginFolders = getPluginsFolder(dir);
      }
      else {
         pluginFolders = pluginFolders.concat(pluginToCompile.split(','));
      }

      var compilePluginFacade = function(pluginFolder, callback) {
         // CLOSURE DEPS
         var facadeLib = path.join(dir, pluginFolder, 'facade',
            'js', '**', '*.js');
         var templatesLib = path.join(templatesDir, '*.js');
         var closureDepsOpts = {
            lib: [
               facadeLib,
               templatesLib
            ],
            cwd: ROOT
         };

         // it adds the export file generated previously
         var exportFileName = 'mapea-'.concat(pluginFolder).concat('.js');
         var exportFile = path.join(exportsDir, exportFileName);

         // it adds the templates file generated previously
         var templatesFile = path.join(templatesDir, hbs.compile(requireTemplatesFile)({
            'plugin': pluginFolder
         }));

         closureComplileOpts.compile.js = [
            exportFile,
            templatesFile
         ];

         // OUTPUT
         var output = path.join(ROOT, outputDir, pluginFolder,
            'mapea.'.concat(pluginFolder).concat('.min.js'));

         compile(closureDepsOpts, closureComplileOpts, output, callback);
      };
      var compilePluginImpl = function(index, pluginImpls, pluginFolder, callback) {
         // base case
         if (pluginImpls.length === index) {
            callback(null);
         }
         // recursvie case
         else {
            var pluginImpl = pluginImpls[index];

            // CLOSURE DEPS
            //            var facadeLib = path.join(dir, pluginFolder, 'facade',
            //               'js', '**', '*.js');
            //            var implLib = path.join(dir, pluginFolder, 'impl',
            //               pluginImpl, 'js', '**', '*.js');
            //            var closureDepsOpts = {
            //               lib: [facadeLib, implLib],
            //               cwd: ROOT
            //            };
            var templatesLib = path.join(templatesDir, '*.js');
            var closureDepsOpts = {
               lib: [
                  path.join(dir, pluginFolder, '**', 'js', '*.js'),
                  templatesLib
               ],
               cwd: ROOT
            };

            // it adds the export file generated previously
            var exportFileName = 'mapea-'.concat(pluginFolder).concat('-').concat(pluginImpl).concat('.js');
            var exportFile = path.join(exportsDir, exportFileName);

            // it adds the templates file generated previously
            var templatesFile = path.join(templatesDir, hbs.compile(requireTemplatesFile)({
               'plugin': pluginFolder
            }));

            closureComplileOpts.compile.js = [
               exportFile,
               templatesFile
            ];

            // OUTPUT
            var output = path.join(ROOT, outputDir, pluginFolder,
               'mapea.'.concat(pluginFolder).concat('.').concat(pluginImpl).concat('.min.js'));

            compile(closureDepsOpts, closureComplileOpts, output, function(err) {
               if (err != null) {
                  grunt.log.error(err);
               }
               // next
               compilePluginImpl(index + 1, pluginImpls, pluginFolder, callback);
            });
         }
      };
      var compilePlugin = function(index, callback) {
         // base case
         if (pluginFolders.length === index) {
            callback(null);
         }
         // recursvie case
         else {
            var pluginFolder = pluginFolders[index];
            var pluginImpls = getPluginImpls(pluginFolder, dir);
            var compilationCallback = function(err) {
               // move css minified
               moveCssMin(pluginFolder, outputDir, function(err) {
                  if (err != null) {
                     grunt.log.error(err);
                  }
                  // next
                  compilePlugin(index + 1, callback);
               });
            };
            grunt.log.writeln('Compiling plugin ' + pluginFolder + '...');
            if (pluginImpls.length === 0) {
               // if it has no implementations then compiles just the facade
               compilePluginFacade(pluginFolder, compilationCallback);
            }
            else {
               // otherwise it compiles all implementations
               compilePluginImpl(0, pluginImpls, pluginFolder, compilationCallback);
            }
         }
      };
      compilePlugin(0, function(err) {
         if (err != null) {
            grunt.log.error(err);
            grunt.log.error('Compilation failed');
         }
         else {
            grunt.log.ok('Compilation succeed');
         }
         done();
         return;
      });
   });

   function getPluginsFolder(dir) {
      return Utils.getFolders(path.join(ROOT, dir), 'archetypePlugin');
   }

   function getPluginImpls(pluginFolder, dir) {
      return Utils.getFolders(path.join(ROOT, dir, pluginFolder, 'impl'));
   }

   function moveCssMin(pluginFolder, outputDir, callback) {
      var cssFileName = pluginFolder.concat('.min.css');
      var src = path.join(ROOT, outputDir, cssFileName);
      var dest = path.join(ROOT, outputDir, pluginFolder, cssFileName);

      fs.move(src, dest, function(err) {
         // hides errors
         callback(null);
      });
   }
};
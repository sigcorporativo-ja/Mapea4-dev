var path = require('path');

/*
   wrapper function (all of the Grunt code must
   be specified inside this function)
*/
module.exports = function(grunt) {
   // Project configuration
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      htmlbuild: {
        dist: {
          src: 'test/index.tpl.html',
          dest: 'test/index.html',
          beautify: true,
          relative: true,
          options: {
            scripts: {
                libs: ['src/<%= grunt.config("name").toLowerCase() %>/impl/**/*.js',
                       'src/<%= grunt.config("name").toLowerCase() %>/facade/**/*Control.js',
                       'src/<%= grunt.config("name").toLowerCase() %>/facade/**/*!(Control).js']            
            },
            styles: {
                libs: 'src/<%= grunt.config("name").toLowerCase() %>/**/*.css'
            },  
            data: {
              pluginName: '<%= grunt.config("name") %>'
            }
          }
        }
    },

      // resolve dependencies
      bower: {
         build: {
            options: {
               targetDir: 'libraries/',
               layout: 'byComponent',
               install: true,
               verbose: false,
               cleanup: true,
               bowerOptions: {}
            }
         }
      },

      prompt: {
         target: {
            options: {
               questions: [{
                  config: 'name',
                  type: 'input', // list, checkbox, confirm, input, password
                  message: 'Nombre del plugin:'
               }/*, {
                  config: 'type',
                  type: 'list', // list, checkbox, confirm, input, password
                  message: 'Tipo del plugin:',
                  choices: [{
                     name: 'button',
                     checked: true
                  }, {
                     name: 'search'
                  }, {
                     name: 'custom'
                  }]
               }, {
                  config: 'panel',
                  type: 'list', // list, checkbox, confirm, input, password
                  message: 'Panel contenedor del plugin:',
                  choices: [{
                     name: 'Herramientas',
                     checked: true
                  }, {
                     name: 'Edición'
                  }, {
                     name: 'Panel propio'
                  }]
               }*/],
               then: function(results, done) {
                grunt.option('plugin-options', results);
                done();
               }
            }
         },
      },

      'plugin-archetype': {
         build: {}
      },

      clean: {
         build: [
            'build/',
            'grunt-tasks/utilities/templates/*'
         ],
         css: [
            "build/*.css",
            "build/**/*.css",
            "!build/**/*.min.css"
         ]
      },

      // checks jshint before and after the concatination
      jshint: {
         check: {
            options: {
               jshintrc: '.jshintrc'
            },
            files: {
               'src': [
                  'src/**/*.js'
               ]
            }
         }
      },

      cssmin: {
         build: {
            files: [{
               expand: true,
               flatten: true,
               cwd: 'src',
               src: ['**/*.css', '!*.min.css'],
               dest: 'build/',
               ext: '.min.css'
            }]
         }
      },

      copy: {
         build: {
            files: [{ // css
               expand: true,
               cwd: 'src',
               src: '**/*.css',
               dest: 'build/',
               flatten: true,
               encoding: 'utf-8'
            }, { // json
               expand: true,
               cwd: 'src',
               src: '**/*.json',
               dest: 'build/',
               flatten: false,
               encoding: 'utf-8'
            }]
         }
      },

      'move-plugins-mincss': {
         build: {
            srcFolder: 'src/',
            targetFolder: 'build/'
         }
      },

      'compile-templates': {
         build: {
            srcFolder: 'src/',
            targetFolder: 'grunt-tasks/utilities/templates/',
            templateOutputFileName: '{{plugin}}.templates.js',
            templateRequireFileName: '{{plugin}}.require.templates.js',
            templateNamespace: "P.templates.{{plugin}}",
            templateAddingMethod: "M.template.add('{{name}}', Handlebars.template({{{fn}}}));"
         }
      },

      'generate-symbols-plugins': {
         build: {
            jsdoc: {
               path: 'node_modules/.bin/jsdoc',
               config: 'grunt-tasks/utilities/jsdoc/info/conf.json'
            },
            dir: 'src',
            outputDir: 'grunt-tasks/utilities/symbols/plugins'
         }
      },

      'generate-exports-plugins': {
         build: {
            dir: 'grunt-tasks/utilities/symbols/plugins',
            outputDir: 'grunt-tasks/utilities/exports/plugins'
         }
      },

      'compile-plugins': {
         build: {
            dir: 'src',
            exportsDir: 'grunt-tasks/utilities/exports/plugins',
            templatesDir: 'grunt-tasks/utilities/templates/',
            requireTemplatesFile: '{{plugin}}.require.templates.js',
            outputDir: 'build/',
            closureComplileOpts: {
               compile: {
                  externs: [],
                  define: [
                     "goog.array.ASSUME_NATIVE_FUNCTIONS=true",
                     "goog.dom.ASSUME_STANDARDS_MODE=true",
                     "goog.json.USE_NATIVE_JSON=true",
                     "goog.DEBUG=false"
                  ],
                  jscomp_error: [
                     "accessControls",
                     "ambiguousFunctionDecl",
                     "checkRegExp",
                     "checkTypes",
                     "checkVars",
                     "const",
                     "constantProperty",
                     "deprecated",
                     "duplicateMessage",
                     "es3",
                     "es5Strict",
                     "fileoverviewTags",
                     "globalThis",
                     "internetExplorerChecks",
                     "invalidCasts",
                     "misplacedTypeAnnotation",
                     "missingGetCssName",
                     "missingProperties",
                     "missingProvide",
                     "missingRequire",
                     "missingReturn",
                     "newCheckTypes",
                     "nonStandardJsDocs",
                     "suspiciousCode",
                     "typeInvalidation",
                     "undefinedNames",
                     "undefinedVars",
                     "unknownDefines",
                     "visibility"
                  ],
                  jscomp_off: [
                     "checkVars",
                     "es3",
                     "missingRequire",
                     "externsValidation",
                     "accessControls",
                     "violatedModuleDep",
                     "missingProperties",
                     "missingProvide",
                     "missingRequire",
                     "newCheckTypes",
                     "nonStandardJsDocs",
                     "suspiciousCode",
                     "strictModuleDepCheck",
                     "undefinedNames",
                     "undefinedVars",
                     "unknownDefines",
                     "checkTypes",
                     "const",
                     "uselessCode"
                  ],
                  extra_annotation_name: ["api", "observable"],
                  language_in: "ECMASCRIPT6",
                  language_out: "ECMASCRIPT5",
                  compilation_level: "SIMPLE",
                  warning_level: "QUIET",
                  use_types_for_optimization: true,
                  manage_closure_dependencies: true,
                  export_local_property_definitions: true,
                  generate_exports: true,
                  js: [],
                  output_wrapper: "(function (M) { %output% })(window.M);"
               }
            }
         }
      }
   });

   // load npm tasks
   grunt.loadNpmTasks('grunt-bower-task');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-jsdoc');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-cssmin');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-prompt');
   grunt.loadNpmTasks('grunt-html-build');

   // load custom tasks
   grunt.loadTasks('./grunt-tasks');

   grunt.registerTask('css-plugins', ['copy', 'cssmin', 'move-plugins-mincss']);
   grunt.registerTask('js-plugins', ['compile-templates', 'generate-symbols-plugins', 'generate-exports-plugins', 'compile-plugins']);

   // tasks
   grunt.registerTask('create-plugin', ['bower', 'prompt', 'plugin-archetype', 'htmlbuild']);
   grunt.registerTask('build-plugins', ['clean:build', 'bower', 'css-plugins', 'js-plugins', 'clean:css']);
   grunt.registerTask('check-plugins', ['jshint:check']);

};

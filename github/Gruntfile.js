/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Task configuration
        clean: {
            build: {
                src: ['dist']
            },
            github: {
                src: ['WebFair/github']
            },
            homologa: {
                src: ['homologa']
            },
            stylesheets: {
                //The line bellow can be changed accordding to the project
                src: ['dist/css/**.css', '!dist/css/styles.min.css', 'homologa/css/**.css', '!homologa/css/styles.min.css']
            },
            temporary: {
                //Clean the temporary folder that the usemin create when is in action
                src: ['.tmp']
            }
        },
        less: {
            compile: {
                options: {
                    // These paths are searched for @imports
                    paths: ["vendor/css"]
                },
                files: {
                    "css/styles.css": "less/styles.less",
                    "css/app.css": "less/app.less",
                }
            }
        },
        copy: {
            //Copy all the files, except that
            build: {
                //The line bellow can be changed accordding to the project
                src: ['**', '!node_modules/**', '!**/Gruntfile.js', '!**/package.json', '!less/**', '!images/psds/**', '!WebFair/**', "!**/*.xlsx", '!testes/**', '!views/**', '!LEVANTAMENTO DE DADOS/**', '!docs/**',"!homologa/**"],
                dest: 'dist',
                expand: true
            },
            endbuild: {
                cwd: '.tmp/concat/css',
                src: '*.css',
                dest: 'dist/css',
                expand: true
            },
            github: {
                src: ['**', '!node_modules/**', '!images/psds/**', '!WebFair/**', '!dist/**', "!**/*.xlsx", '!LEVANTAMENTO DE DADOS/**',"!docs/**","!homologa/**","!_hugo/**"],
                dest: 'WebFair/github',
                expand: true
            },
            homologa: {
                src: ['**', '!**/Gruntfile.js', '!**/package.json', '!images/psds/**', '!WebFair/**', '!dist/**', "!**/*.xlsx", '!testes/**', '!views/**', '!LEVANTAMENTO DE DADOS/**', '!docs/**',"!_hugo/**"],
                dest: 'homologa',
                expand: true
            }
        },
        watch: {
            less: {
                files: 'less/*.less',
                tasks: ['less']
            },
            jsdoc: {
                files: 'js/**/*.js',
                tasks: ['jsdoc']
            }
        },

        //Usemin Task
        useminPrepare: {
            html: ['dist/**.html']
        },
        usemin: {
            html: ['dist/**.html']
        },

        cssmin: {
            combine: {
                files: {
                    'dist/css/styles.min.css': ['dist/css/styles.min.css'],
                    'homologa/css/styles.min.css': ['homologa/css/styles.min.css'],
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['js/app.js', 'js/app/*.js', 'js/login.js', 'js/envioemail.js'],
                options: {
                    destination: 'docs',
                    //It's use a template configuration in it's folder
                    template: "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure: "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
                        /*
                          https://github.com/krampstudio/grunt-jsdoc
                          http://terryweiss.github.io/docstrap/themes/cosmo/index.html
                          http://usejsdoc.org/about-getting-started.html#generating-a-website
                        */
                }
            },
            homologa: {
                src: ['js/app.js', 'js/app/*.js', 'js/login.js','js/envioemail.js'],
                options: {
                    destination: 'docs',
                    //It's use a template configuration in it's folder
                    template: "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure: "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
                        /*
                          https://github.com/krampstudio/grunt-jsdoc
                          http://terryweiss.github.io/docstrap/themes/cosmo/index.html
                          http://usejsdoc.org/about-getting-started.html#generating-a-website
                        */
                }
            }
        }
        //Uglify Angular
        /*uglify: {
           options: {
                  report: 'min',
                  mangle: false
              },
              my_target : {
                  files : {
                      'dist/js/app.js' : ['dist/js/app.js'],
                      'dist/js/motivos.js' : ['dist/js/motivos.js'],
                      'dist/js/directive.js' : ['dist/js/directive.js']
                  }
              }
          }*/
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc');

    //Register tasks
    grunt.registerTask(
        'default',
        'In action with grunt', ['dev']
    );

    grunt.registerTask(
        'github',
        'Copy files to github folder', ['clean:github', 'copy:github']
    );

    grunt.registerTask(
        //Clean and call the minifier task
        'build',
        'To deploy', ['clean:build', 'copy:build', 'minifier']
    );

    grunt.registerTask(
        'homologa',
        'To deploy', ['clean:homologa', 'copy:homologa']
    );


    //Task de minificação
    grunt.registerTask(
        'minifier',
        'To minifier the css and js files, clean the other files after', ['useminPrepare', 'usemin', 'concat', 'clean:stylesheets', 'copy:endbuild', 'clean:temporary' /*,'uglify'*/ , 'cssmin']
    );

    grunt.registerTask(
        'dev',
        'Developing', ['watch', 'jsdoc']
    );
}
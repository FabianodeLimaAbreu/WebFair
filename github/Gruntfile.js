/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration
    clean: {
      build: {
        src: ['dist']
      },
      github:{
        src: ['WebFair/github']
      },
      stylesheets:{
        //The line bellow can be changed accordding to the project
        src:['dist/css/**.css','!dist/css/styles.min.css']
      },
      temporary:{
        //Clean the temporary folder that the usemin create when is in action
        src:['.tmp']
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
    copy:{
      //Copy all the files, except that
      build:{
        //The line bellow can be changed accordding to the project
        src:['**','!node_modules/**','!**/Gruntfile.js','!**/package.json','!less/**','!images/psds/**','!WebFair/**',"!**/*.xlsx"],
        dest:'dist',
        expand:true
      },
      endbuild:{
        cwd:'.tmp/concat/css',
        src:'*.css',
        dest:'dist/css',
        expand:true
      },
      github:{
        src:['**','!node_modules/**','!images/psds/**','!WebFair/**','!dist/**',"!**/*.xlsx"],
        dest:'WebFair/github',
        expand:true
      }
    },
    watch: {
      less:{
        files: 'less/*.less',
        tasks: ['less']
      }
    },

    //Usemin Task
    useminPrepare:{
      html:['dist/**.html']
    },
    usemin:{
      html:['dist/**.html']
    },

    cssmin: {
      combine: {
        files: {
          'dist/css/styles.min.css': ['dist/css/styles.min.css']
        }
      }
    },

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

  //Register tasks
  grunt.registerTask(
    'default',
    'In action with grunt',
    ['dev']
  );

  grunt.registerTask(
    'github',
    'Copy files to github folder',
    ['clean:github','copy:github']
  )
  grunt.registerTask(
    //Clean and call the minifier task
    'build',
    'To deploy',
    ['clean:build','copy:build','minifier']
  );

  //Task de minificação
  grunt.registerTask(
    'minifier',
    'To minifier the css and js files, clean the other files after',
    ['useminPrepare','usemin','concat','clean:stylesheets','copy:endbuild','clean:temporary'/*,'uglify'*/,'cssmin']
  );

  grunt.registerTask(
    'dev',
    'Developing',
    ['watch']
  );
};
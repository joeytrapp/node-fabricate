module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      all: [
        'Gruntfile.js',
        'index.js',
        'lib/**/*.js'
      ]
    },

    nodeunit: {
      tests: ['test/**/*_test.js'],
    },

    watch: {
      test: {
        files: ['index.js', 'lib/**/*.js', 'test/**/*.js'],
        tasks: ['test']
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'nodeunit']);
  grunt.registerTask('autotest', ['test', 'watch:test']);

  grunt.registerTask('default', ['autotest']);
};

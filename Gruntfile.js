'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks') (grunt);

    grunt.initConfig ({
        jshint: {
            options: {
            	globals: {
            		_: true
                } ,
                node: true ,
                eqeqeq: true ,
                undef: true ,
                eqnull: true ,
                browser: true ,
                smarttabs: true
            } ,
            dist: {
                src: ['index.js']
            }
        } ,
        watch: {
            dist: {
                files: ['index.js', 'Gruntfile.js'] ,
                tasks: ['jshint']
            }
        } ,
        express: {
            livereload: {
                options: {
                    script: 'demo/app.js'
                }
            }
        } ,
        connect: {
            options: {
                port: 9000 ,
                livereload: 35729
            } ,
            livereload: {
                options: {
                    open: 'http://localhost:9000/demo/index.html'
                }
            }
        }
    });

    grunt.registerTask ('server', ['express', 'connect:livereload', 'watch']);
};

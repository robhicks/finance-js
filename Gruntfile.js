"use strict";

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine_node: {
            specNameMatcher: "spec", // load only specs containing specNameMatcher
            projectRoot: ".",
            requirejs: false,
            forceExit: true,
            jUnit: {
                report: false,
                savePath: "./build/reports/jasmine/",
                useDotNotation: true,
                consolidate: true
            }
        },
        watch: {
            files: ['*.js', './spec/*.js'],
            tasks: ['jasmine_node']
        }
    });


    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', function () {
        grunt.log.subhead(">>> Use 'grunt jasmine' to run Jasmine specs");
    });

    grunt.registerTask("jasmine", ["jasmine_node"]);
};
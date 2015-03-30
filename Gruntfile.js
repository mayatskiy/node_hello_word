var pkg = require('./package.json');

module.exports = function (grunt) {

    grunt.initConfig({
        shipit: {
            options: {
                // Project will be build in this directory.
                workspace: '/var/tmp/workspace',

                // Project will be deployed in this directory.
                deployTo: '/home/ec2-user/node_hello_word',

                // Repository url.
                repositoryUrl: 'https://github.com/mayatskiy/node_hello_word',

                // This files will not be transfered.
                ignores: ['.git', 'node_modules'],

                // Number of release to keep (for rollback).
                keepReleases: 3
            },

            // Staging environment.
            staging: {
                servers: [process.env.SERVER_URL],
                key: [process.env.PATH_TO_KEY]
            }
        }
    });

    /**
     * Load shipit task.
     */

    grunt.loadNpmTasks('grunt-shipit');
    grunt.loadNpmTasks('shipit-deploy');

    var startStop = function (command, context){
        var done = context.async();
        var current = grunt.config('shipit.options.deployTo') + '/current';
        command == 'start' ? command = 'start ./bin/www' : command = 'stopall';
        grunt.shipit.remote('cd ' + current + ' && forever ' + command, done);

    };

    grunt.registerTask('start', function () {
        startStop('start', this);
    });

    grunt.registerTask('stop', function () {
        startStop('stop', this);
    });

    grunt.shipit.on('fetched', function () {
        grunt.task.run(['stop']);
    });

    grunt.shipit.on('published', function () {
        grunt.task.run(['start']);
    });
};
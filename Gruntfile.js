module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			'core.bundle.js': ['core.js']
		},
		watch: {
			files: [
				'core.js',
				'modules/**/*.js'
			],
			tasks: [
				'browserify'
			]
		}
	})
	grunt.loadNpmTasks('grunt-browserify')
	grunt.loadNpmTasks('grunt-contrib-watch')
}
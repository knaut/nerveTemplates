module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			'core.bundle.js': ['core.js'],
			'app1.bundle.js': ['testApps/app1.js']
		},
		watch: {
			files: [
				'core.js',
				'component.js',
				'modules/*.js',
				'modules/**/*.js',
				'testApps/*.js',
				'testApps/*.html'
			],
			tasks: [
				'browserify'
			]
		}
	})
	grunt.loadNpmTasks('grunt-browserify')
	grunt.loadNpmTasks('grunt-contrib-watch')
}
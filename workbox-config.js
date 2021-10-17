module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{svg,js,css,html}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'dist/sw.js'
};
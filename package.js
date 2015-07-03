Package.describe({
	name: 'floriannagel:social-media-feed',
	version: '0.0.1',
	// Brief, one-line summary of the package.
	summary: 'Aggregated social media feed',
	// URL to the Git repository containing the source code for this package.
	git: 'https://github.com/nagelflorian/meteor-social-media-feed.git',
	// By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: 'README.md'
});

Package.onUse(function(api) {
	api.versionsFrom('1.1.0.2');
	api.use(['templating'], 'client');
	api.use('mongo', ['client', 'server']);
	api.addFiles('lib/collection.js', ['client', 'server']);
	api.addFiles('lib/server/social_networks.js', 'server');
	api.addFiles(['lib/client/grid.html', 'lib/client/tile.html'], 'client');
	api.addFiles(['lib/client/grid.js', 'lib/client/tile.js'], 'client');
	api.addFiles('lib/client/style.css', 'client');

	api.export('SocialMediaFeed', 'server');
	api.export('FeedCollection');
});

Package.onTest(function(api) {
	api.use(['floriannagel:social-media-feed', 'tinytest', 'http']);
	api.addFiles('social-media-feed-tests.js');
});

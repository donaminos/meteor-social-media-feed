Meteor.publish('social_media_feed', function() {
	return FeedCollection.find({
		"hidden": {$ne: true}
	}, {
		sort: {created_at: -1},
		limit: 50
	});
});
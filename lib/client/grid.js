Template.SocialMediaFeed.created = function() {
	Meteor.subscribe('social_media_feed');
};
Template.SocialMediaFeed.rendered = function() {
};

Template.SocialMediaFeed.helpers({
	socialMedia: function() {
		return FeedCollection.find({}, {sort: {created_at: -1}, limit: 50});
	}
});
Template.SocialMediaFeed.created = function() {
	Meteor.subscribe('social_media_feed');
};

Template.SocialMediaFeed.rendered = function() {
	Session.set("tileClass", this.data.tileClass);


	// // infinite scroll
	// $(window).scroll(function() {
	// 	console.log("scroll");
	// });
};

Template.SocialMediaFeed.helpers({
	ready: function() {
		Meteor.subscribe("social_media_feed").ready();
	},
	item: function() {
		return FeedCollection.find({}, {sort: {created_at: -1}, limit: 50}).fetch();
	}
});
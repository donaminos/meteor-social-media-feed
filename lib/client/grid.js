if (Meteor.isClient) {
	Meteor.subscribe('social_media_feed');
}

Template.SocialMediaFeed.created = function() {
};
Template.SocialMediaFeed.rendered = function() {
	var msnry = new Masonry( '#mosaic-container', {
		columnWidth: 320,
		itemSelector: '.tile'
	});

	// $('#mosaic-container').masonry({
 //        itemSelector: '.tile',
 //        columnWidth: 320
 //    }).masonry('reload');
};

Template.SocialMediaFeed.helpers({
	socialMedia: function() {
		return FeedCollection.find({}, {sort: {created_at: -1}, limit: 50});
	}
});
/**
 * Social Network Aggregation
 * collects data from connected networks and adds them
 * to feed collection
 */

SocialMediaFeed = {
	options: {
		// Log details to console
		log: false,
		// enable pagination of feed
		pagination: false,	// to-do
		// Profile Ids from social media accounts
		facebookIds: [],
		instagramIds: [],
		instagramTags: []
	},
	config: function(opts) {
		this.options = _.extend({}, this.options, opts);
	}
};

// insert own content
SocialMediaFeed.addContent = function(title, url, imageLink, socialNetwork, contentType, additionalData) {
	// to-do: add alt tag if contentType is image


	switch (contentType) {
		case "image":
			console.log("image feed item");
			break;
		case "text":
			console.log("text feed item");
			break;
		case "date":
			console.log("text feed item");
			break;
		default:
			throw new Meteor.Error("ContentType is not a valid type. You can only use 'text', 'image' or 'date'.");
	}

	if (typeof title !== 'undefined' && typeof url !== 'undefined' && typeof imageLink !== 'undefined' && typeof contentType !== 'undefined') {
		return FeedCollection.insert({
			"social_network": "custom", "content_type": contentType, "title": title,
			"url": url, "image_link": imageLink, "created_at": new Date(), "data": additionalData
		}, function (error, id) {
			if (error) {
				throw new Meteor.Error("Insert Content in Feed", error);
			}
			if (id) {
				return id
			}
		});
	} else {
		throw new Meteor.Error("Insert Content in Feed", "You haven't passed all neccessary arguments");
	}
};

// gathers content from all connected networks
SocialMediaFeed.update = function() {
	console.log("Content Refresh");
	
	if (SocialMediaFeed.options.facebookIds.length > 0) {
		SocialMediaFeed.getFacebookContent();
	}
	if (SocialMediaFeed.options.instagramIds.length > 0) {
		SocialMediaFeed.getInstagramContent();
	}
	if (SocialMediaFeed.options.instagramTags.length > 0) {
		SocialMediaFeed.getInstagramTagData();
	}
};

// resets feed collection
SocialMediaFeed.reset = function() {
	FeedCollection.remove({});
};

// hide content from appearing in the feed
SocialMediaFeed.hideContent = function(id) {
	var content = FeedCollection.find({"_id": id}).fetch();

	// check if doc exists
	if (content.length == 1) {
		// hide content
		FeedCollection.update({
			"_id": id
		}, {
			$set: {"hidden": true}
		});

		return true
	} else if (content.length > 1) {
		throw new Meteor.Error("Hide Feed content", 'Found multiple results for contentId: ' + id + ' from: ' + network);
	} else {
		throw new Meteor.Error('Hide Feed content', 'ContentId: ' + id + ' is not in the social media feed');
	}
};

// Helper function
SocialMediaFeed.getContentIds = function(socialNetworkQuery) {
	var results = FeedCollection.find({social_network: socialNetworkQuery}, {fields: {content_id: 1}}).fetch();
	// stream.find(...) returns an array of results with _id and content_id
	var contentIds = [];
	
	for (id in results) {
		contentIds.push(results[id].content_id);
	}

	return contentIds;
};
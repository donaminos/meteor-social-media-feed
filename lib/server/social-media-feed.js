/**
 * Social Network Aggregation
 * collects data from connected networks and adds them
 * to feed collection
 */

SocialMediaFeed = {
	options: {
		// Log details to console
		log: true,
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

// --------------------------------------------------------- //
// ------------------------  Logger ------------------------ //
// --------------------------------------------------------- //

function createLogger(prefix) {
	check(prefix, String);

	// return null if logging is disabled.
	if (SocialMediaFeed.options.log === false) {
		return function() {};
	}

	return function(level, message) {
		check(level, Match.OneOf('info', 'error', 'warn'));
		check(message, String);

		Log[level]({ message: prefix + ': ' + message });
	}
};

var log;

Meteor.startup(function () {
	log = createLogger("SocialMediaFeed");
	['info', 'warn', 'error'].forEach(function(level) {
		log[level] = _.partial(log, level);
	});
});


// --------------------------------------------------------- //
// -------------  Feed Update + Reset Functions ------------ //
// --------------------------------------------------------- //

SocialMediaFeed.update = function() {
	log.info("Started content update.");
	
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

SocialMediaFeed.reset = function() {
	FeedCollection.remove({});
	log.info("Removed all content from database.");
};


// --------------------------------------------------------- //
// ---------------  Custom Content Functions --------------- //
// --------------------------------------------------------- //

SocialMediaFeed.addText = function(network, title, url) {
	check(network, String);
	check(title, String);
	check(url, String);

	FeedCollection.insert({
		"social_network": network, "content_type": "custom-text", "title": title,
		"url": url, "created_at": new Date()
	}, function (error, id) {
		if (error) {
			throw new Meteor.Error("Error: Adding custom text-post to feed", error);
		}
		if (id) {
			log.info("Added custom text-post to feed");
			return id
		}
	});
};

SocialMediaFeed.addImage = function(network, title, url, imageUrl, imageAlt) {
	check(network, String);
	check(title, String);
	check(url, String);
	check(imageUrl, String);
	check(imageAlt, String);

	FeedCollection.insert({
		"social_network": network, "content_type": "custom-image", "title": title,
		"url": url, "image_url": imageUrl, "image_alt": imageAlt, "created_at": new Date()
	}, function (error, id) {
		if (error) {
			throw new Meteor.Error("Error: Adding custom image-post to feed", error);
		}
		if (id) {
			log.info("Added custom image-post to feed");
			return id
		}
	});
};

SocialMediaFeed.addDate = function(network, date, title, url) {
	check(network, String);
	check(date, String);
	check(title, String);
	check(url, String);

	FeedCollection.insert({
		"social_network": network, "content_type": "custom-date", "title": title,
		"url": url, "date": date, "created_at": new Date()
	}, function (error, id) {
		if (error) {
			throw new Meteor.Error("Error: Adding custom date/event-post to feed", error);
		}
		if (id) {
			log.info("Added custom date/event-post to feed");
			return id
		}
	});
};


// --------------------------------------------------------- //
// -----------------  Hide Content Function ---------------- //
// --------------------------------------------------------- //

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

		log.info["Removed content with id: " + id + " from feed."]

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


// --------------------------------------------------------- //
// -----------  Social Networks Data Aggregation ----------- //
// --------------------------------------------------------- //

SocialMediaFeed.getFacebookContent = function getFacebookContentF() {
	this.unblock;

	log.info("Aggregating Facebook profile posts");

	var appId = Meteor.settings.facebook_keys.app_id;
	var appSecret = Meteor.settings.facebook_keys.app_secret;
	var authToken = Meteor.http.call("GET", "https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=" + appId + "&client_secret=" + appSecret).content;
	var facebookProfiles = SocialMediaFeed.options.facebookIds;

	for (var i=0; i<facebookProfiles.length; i++) {
		var url = "https://graph.facebook.com/" + facebookProfiles[i] + "/feed?" + authToken;
		callFacebookAPI(url);
	}
};
SocialMediaFeed.getInstagramContent = function getInstagramContentF() {
	this.unblock;

	log.info("Aggregating Instagram profile images.");

	var instagramProfiles = SocialMediaFeed.options.instagramIds;
	var clientId = Meteor.settings.instagram_keys.client_id;

	for (var i=0; i<instagramProfiles.length; i++) {
		var url = "https://api.instagram.com/v1/users/" + instagramProfiles[i] + "/media/recent?client_id=" + clientId;
		callInstagramAPI(url, "profile_data");
	}
};
SocialMediaFeed.getInstagramTagData = function getInstagramTagDataF() {
	this.unblock;

	log.info("Aggregating Instagram images by tags.");

	var instagramProfiles = SocialMediaFeed.options.instagramIds;
	var clientId = Meteor.settings.instagram_keys.client_id;
	var accessToken = Meteor.settings.instagram_keys.access_token;

	var tags = SocialMediaFeed.options.instagramTags;

	for (var i=0; i<tags.length; i++) {
		var url = "https://api.instagram.com/v1/tags/" + tags[i] + "/media/recent?access_token=" + accessToken;
		callInstagramAPI(url, "tag_data");
	}
};

var callFacebookAPI = function callFacebookAPIF(url) {
	Meteor.http.call("GET", url, function(error, results) {

		if (error) {
			throw new Meteor.Error('GET Facebook Data', 'There was an error processing your request');
		}

		if (results) {
			var response = JSON.parse(results.content);

			if (response.data) {
				var jsonData = JSON.parse(results.content).data;
				var existingContentIds = SocialMediaFeed.getContentIds("facebook");

				for (var i = 0; i < jsonData.length; i++) {
					// check if content is already present in feed collection
					if (existingContentIds.indexOf(jsonData[i].id) == -1) {
						// insert new content in collection	
						var date = new Date(jsonData[i].created_time);
						date.toJSON();

						// request large image if available
						var largeImage = "";
						if (jsonData[i].object_id) {
							largeImage = "https://graph.facebook.com/" + jsonData[i].object_id + "/picture";						var createdTime = JSON.parse(results.content).data[i].created_time;
						}

						FeedCollection.insert({
							"social_network": "facebook", "content_id": jsonData[i].id,
							"created_at": jsonData[i].created_time,"data": jsonData[i], "large_image": largeImage
						});
					}
				}
			} else {
				var error = JSON.parse(results.content).error
				throw new Meteor.Error(error.code, error.message);
			}
		}
	});
}

var callInstagramAPI = function callInstagramAPIF(url, contentType) {
	Meteor.http.call("GET", url, function(error, results) {
		
		if (error) {
			throw new Meteor.Error('GET Instagram Data', 'There was an error processing your request');
		}

		if (results) {
			var response = JSON.parse(results.content).meta;

			if (response.code == 200) {
				var jsonData = JSON.parse(results.content).data;
				var existingContentIds = SocialMediaFeed.getContentIds("instagram");

				for (var i = 0; i < jsonData.length; i++) {
					// check if content is already present in feed collection
					if (existingContentIds.indexOf(jsonData[i].id) == -1) {
						// insert new content in collection	
						var date = new Date(jsonData[i].created_time * 1000);

						FeedCollection.insert({
							"social_network": "instagram", "content_id": jsonData[i].id, "content_type": contentType,
							"created_at": date, "data": jsonData[i]
						});
					}
				}
			} else {
				var status = JSON.parse(results.content).meta
				throw new Meteor.Error(status.code, status.error_message);
			}
		}
	});
};
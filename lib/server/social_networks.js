/**
 * Social Network Aggregation
 * collects data from connected networks and adds them
 * to feed collection
 */

Meteor.publish('social_media_feed', function() {
	return FeedCollection.find({}, {sort: {created_at: -1}, limit: 50});
});

SocialMediaFeed = {
	options: {
		// Log details to console
		log: false,
		// enable pagination of feed
		pagination: false,
		// Profile Ids from social media accounts
		facebookIds: [],
		instagramIds: [],
		twitterIds: [],		// to-do
	},
	config: function(opts) {
		this.options = _.extend({}, this.options, opts);
	}
}

// gathers content from all connected networks
SocialMediaFeed.update = function() {
	if (SocialMediaFeed.options.facebookIds.length > 0) {
		getFacebookContent();
	}
	if (SocialMediaFeed.options.instagramIds.length > 0) {
		getInstagramContent();
	}
};

// resets feed collection
SocialMediaFeed.reset = function() {
	FeedCollection.remove({});
};

var getInstagramContent = function getInstagramContentF() {
	this.unblock;

	var instagramProfiles = SocialMediaFeed.options.instagramIds;
	var clientId = Meteor.settings.instagram_keys.client_id;

	for (var i=0; i<instagramProfiles.length; i++) {
		var url = "https://api.instagram.com/v1/users/" + instagramProfiles[i] + "/media/recent?client_id=" + clientId;
		callInstagramAPI(url);
	}
};

var getFacebookContent = function getFacebookContentF() {
	this.unblock;

	var appId = Meteor.settings.facebook_keys.app_id;
	var appSecret = Meteor.settings.facebook_keys.app_secret;
	var authToken = Meteor.http.call("GET", "https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=" + appId + "&client_secret=" + appSecret).content;
	var facebookProfiles = SocialMediaFeed.options.facebookIds;

	for (var i=0; i<facebookProfiles.length; i++) {
		var url = "https://graph.facebook.com/" + facebookProfiles[i] + "/feed?" + authToken;
		callFacebookAPI(url);
	}
};


var callInstagramAPI = function callInstagramAPIF(url) {
	Meteor.http.call("GET", url, function(error, results) {
		if (error) {
			console.log(url);
			throw new Meteor.Error('GET Instagram Data', 'There was an error processing your request');
		}

		if (results) {
			var response = JSON.parse(results.content).meta;

			if (response.code == 200) {
				var jsonData = JSON.parse(results.content).data;
				var existingContentIds = getContentIds("instagram");

				for (var i = 0; i < jsonData.length; i++) {
					// check if content is already present in feed collection
					if (existingContentIds.indexOf(jsonData[i].id) == -1) {
						// insert new content in collection	
						var date = new Date(jsonData[i].caption.created_time * 1000);

						FeedCollection.insert({
							social_network: "instagram", content_id: jsonData[i].id,
							created_at: date ,data: jsonData[i]
						});
					}
				}
			} else {
				// Status Code is not 200
				var status = JSON.parse(results.content).meta
				throw new Meteor.Error(status.code, status.error_message);
			}
		}
	});
};

var callFacebookAPI = function callFacebookAPIF(url) {
	Meteor.http.call("GET", url, function(error, results) {
		// Error handling
		if (error) {
			throw new Meteor.Error('GET Facebook Data', 'There was an error processing your request');
		}

		// Check if Result
		if (results) {
			var response = JSON.parse(results.content);

			if (response.data) {
				var jsonData = JSON.parse(results.content).data;
				var existingContentIds = getContentIds("facebook");

				for (var i = 0; i < jsonData.length; i++) {
					// check if content is already present in feed collection
					if (existingContentIds.indexOf(jsonData[i].id) == -1) {
						// insert new content in collection	
						var date = new Date(jsonData[i].created_time);
						// request large image if available
						var largeImage = "";
						if (jsonData[i].object_id) {
							largeImage = "https://graph.facebook.com/" + jsonData[i].object_id + "/picture";						var createdTime = JSON.parse(results.content).data[i].created_time;
						}

						FeedCollection.insert({
							social_network: "facebook", content_id: jsonData[i].id,
							created_at: date ,data: jsonData[i], large_image: largeImage
						});
					}
				}
			} else {
				// Status Code is not 200
				var error = JSON.parse(results.content).error
				throw new Meteor.Error(error.code, error.message);
			}
		}
	});
}

// Helper functions
var getContentIds = function getContentIdsF(socialNetworkQuery) {
	var results = FeedCollection.find({social_network: socialNetworkQuery}, {fields: {content_id: 1}}).fetch();
	// stream.find(...) returns an array of results with _id and content_id
	var contentIds = [];
	for (id in results) {
		contentIds.push(results[id].content_id);
	}

	return contentIds;
};
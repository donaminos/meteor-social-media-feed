SocialMediaFeed.getInstagramContent = function getInstagramContentF() {
	this.unblock;

	var instagramProfiles = SocialMediaFeed.options.instagramIds;
	var clientId = Meteor.settings.instagram_keys.client_id;

	for (var i=0; i<instagramProfiles.length; i++) {
		var url = "https://api.instagram.com/v1/users/" + instagramProfiles[i] + "/media/recent?client_id=" + clientId;
		callInstagramAPI(url, "profile_data");
	}
};

SocialMediaFeed.getInstagramTagData = function getInstagramTagDataF() {
	this.unblock;

	var instagramProfiles = SocialMediaFeed.options.instagramIds;
	var clientId = Meteor.settings.instagram_keys.client_id;
	var accessToken = Meteor.settings.instagram_keys.access_token;

	var tags = SocialMediaFeed.options.instagramTags;

	for (var i=0; i<tags.length; i++) {
		var url = "https://api.instagram.com/v1/tags/" + tags[i] + "/media/recent?access_token=" + accessToken;
		callInstagramAPI(url, "tag_data");
	}
};

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
				// Status Code is not 200
				var status = JSON.parse(results.content).meta
				throw new Meteor.Error(status.code, status.error_message);
			}
		}
	});
};
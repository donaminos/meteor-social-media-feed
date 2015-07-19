SocialMediaFeed.getFacebookContent = function getFacebookContentF() {
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
				var existingContentIds = SocialMediaFeed.getContentIds("facebook");

				for (var i = 0; i < jsonData.length; i++) {
					// check if content is already present in feed collection
					if (existingContentIds.indexOf(jsonData[i].id) == -1) {
						// insert new content in collection	
						var date = new Date(jsonData[i].created_time);
						date.toJSON();

						console.log(date);

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
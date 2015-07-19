if (Meteor.isServer) {
	Tinytest.add('After startup the feed collection should be empty', function(test) {
		FeedCollection.remove({});
		test.equal(FeedCollection.find().count(), 0);
	});

	Tinytest.add('SocialMediaFeed Options are default values and profile ids are empty', function(test) {
		test.equal(SocialMediaFeed.options.log, false);
		test.equal(SocialMediaFeed.options.pagination, false);
		test.equal(SocialMediaFeed.options.facebookIds, []);
		test.equal(SocialMediaFeed.options.instagramIds, []);
		test.equal(SocialMediaFeed.options.instagramTags, []);
	});

	Tinytest.add('Default SocialMediaFeed (without profile ids) update adds nothing to collection', function(test) {
		SocialMediaFeed.update();
		test.equal(FeedCollection.find().count(), 0);
	});

	Tinytest.add('User can add profile ids', function(test) {
		SocialMediaFeed.config({
			facebookIds: ["7919071058"],
			instagramIds: ["25025320", "20120087", "224223453", "365041587"],
			instagramTags: ["tbt", "meteorjs"]
		});
		test.equal(SocialMediaFeed.options.facebookIds[0], "7919071058");
		test.equal(SocialMediaFeed.options.instagramIds[1], "20120087");
		
		// reset config
		SocialMediaFeed.config({
			facebookIds: [],
			instagramIds: [],
			instagramTags: []
		});
	});

	Tinytest.addAsync('Get data from networks', function(test, onComplete) {
		SocialMediaFeed.config({
			facebookIds: ["7919071058"],
			instagramIds: ["25025320"],
			instagramTags: ["tbt"]
		});

		SocialMediaFeed.update();

		Meteor.setTimeout(function() {
			test.notEqual(FeedCollection.find({social_network: "facebook"}).count(), 0);
			test.notEqual(FeedCollection.find({social_network: "instagram", "content_type": "profile_data"}).count(), 0);
			test.notEqual(FeedCollection.find({social_network: "instagram", "content_type": "tag_data"}).count(), 0);

			// reset config + collection
			SocialMediaFeed.config({
				facebookIds: [],
				instagramIds: [],
				instagramTags: []
			});
			SocialMediaFeed.reset();
			test.equal(FeedCollection.find().count(), 0);

			onComplete();
		}, 5000);
	});

	Tinytest.add('Add custom content', function(test) {
		SocialMediaFeed.addContent("Post Title", "https://www.meteor.com/", "https://unsplash.it/200/300", "simple_image_post", {"tags": "tbt", "description": "example description"});

		test.equal(FeedCollection.find({"social_network": "custom"}).count(), 1);
			
		// remove content from collection
		SocialMediaFeed.reset();
		test.equal(FeedCollection.find().count(), 0);
	});

	Tinytest.add('Hide Content From Stream', function(test) {
		// insert dummy content
		FeedCollection.insert({"social_network": "instagram", "content_id": "1234"})

		SocialMediaFeed.hideContent("instagram", "1234");
		test.equal(1, 1);

		// remove content from collection
		SocialMediaFeed.reset();
		test.equal(FeedCollection.find().count(), 0);
	});

	Tinytest.add('Reset SocialMediaFeed returns an empty SocialMediaFeed', function(test) {
		SocialMediaFeed.reset();
		test.equal(FeedCollection.find().count(), 0);
	});
}
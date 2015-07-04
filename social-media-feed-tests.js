// Write your tests here!

if (Meteor.isServer) {
	Tinytest.add('After startup the feed collection should be empty', function (test) {
		FeedCollection.remove({});
		test.equal(FeedCollection.find().count(), 0);
	});

	Tinytest.add('SocialMediaFeed Options are default values and profile ids are empty', function (test) {
		test.equal(SocialMediaFeed.options.log, false);
		test.equal(SocialMediaFeed.options.pagination, false);
		test.equal(SocialMediaFeed.options.facebookIds, []);
		test.equal(SocialMediaFeed.options.instagramIds, []);
		test.equal(SocialMediaFeed.options.instagramTags, []);
	});

	Tinytest.add('Default SocialMediaFeed (without profile ids) update adds nothing to collection', function (test) {
		SocialMediaFeed.update();
		test.equal(FeedCollection.find().count(), 0);
	});

	Tinytest.add('User can add profile ids', function (test) {
		SocialMediaFeed.config({
			facebookIds: "7919071058",
			instagramIds: ["25025320", "20120087", "224223453", "365041587"],
			instagramTags: ["tbt", "meteorjs"]
		});
		test.equal(SocialMediaFeed.options.facebookIds, "7919071058");
		test.equal(SocialMediaFeed.options.instagramIds[1], "20120087");
		
		// reset config
		SocialMediaFeed.config({
			facebookIds: [],
			instagramIds: []
		});
	});

	Tinytest.addAsync('Get Facebook Data', function (test, onComplete) {
		SocialMediaFeed.config({
			facebookIds: ["7919071058"]
		});

		SocialMediaFeed.update();

		Meteor.setTimeout(function() {
			test.notEqual(FeedCollection.find({social_network: "facebook"}).count(), 0);

			// reset config + collection
			SocialMediaFeed.config({facebookIds: []});
			SocialMediaFeed.reset();
			test.equal(FeedCollection.find({social_network: "facebook"}).count(), 0);

			onComplete();
		}, 5000);
	});

	Tinytest.addAsync('Get Instagram Profile Data', function (test, onComplete) {
		SocialMediaFeed.config({
			instagramIds: ["25025320"]
		});

		SocialMediaFeed.update();

		Meteor.setTimeout(function() {
			test.notEqual(FeedCollection.find({social_network: "instagram"}).count(), 0);

			// reset config + collection
			SocialMediaFeed.config({instagramIds: []});
			SocialMediaFeed.reset();
			test.equal(FeedCollection.find({social_network: "instagram"}).count(), 0);

			onComplete();
		}, 5000);
	});

	Tinytest.addAsync('Get Instagram Hashtag Data', function (test, onComplete) {
		SocialMediaFeed.config({
			instagramTags: ["tbt"]
		});

		SocialMediaFeed.update();

		Meteor.setTimeout(function() {
			test.notEqual(FeedCollection.find({social_network: "instagram"}).count(), 0);

			// reset config + collection
			SocialMediaFeed.config({instagramIds: []});
			SocialMediaFeed.reset();
			test.equal(FeedCollection.find({social_network: "instagram"}).count(), 0);

			onComplete();
		}, 5000);
	});

	Tinytest.add('Hide Content From Stream', function (test) {
		// insert dummy content
		FeedCollection.insert({"social_network": "instagram", "content_id": "1234"})

		SocialMediaFeed.hideContent("instagram", "1234");
		test.equal(1, 1);

		// remove content from collection
		SocialMediaFeed.reset();
		test.equal(FeedCollection.find().count(), 0);
	});

	Tinytest.add('Reset SocialMediaFeed returns an empty SocialMediaFeed', function (test) {
		SocialMediaFeed.reset();
		test.equal(FeedCollection.find().count(), 0);
	});
}

if (Meteor.isClient) {
}
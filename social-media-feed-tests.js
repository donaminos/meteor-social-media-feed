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
	});
	Tinytest.add('Default SocialMediaFeed (without profile ids) update adds nothing to collection', function (test) {
		SocialMediaFeed.update();
		test.equal(FeedCollection.find().count(), 0);
	});
	Tinytest.add('User can add profile ids', function (test) {
		SocialMediaFeed.config({
			facebookIds: "7919071058",
			instagramIds: ["25025320", "20120087", "224223453", "365041587"]
		});
		test.equal(SocialMediaFeed.options.facebookIds, "7919071058");
		test.equal(SocialMediaFeed.options.instagramIds[1], "20120087");
		// reset config
		SocialMediaFeed.config({
			facebookIds: [],
			instagramIds: []
		});
	});
	Tinytest.addAsync('Update SocialMediaFeed gets results and adds them to collection', function (test, onComplete) {
		SocialMediaFeed.config({
			facebookIds: "7919071058",
			instagramIds: ["25025320", "20120087", "224223453", "365041587"]
		});

		SocialMediaFeed.update();

		Meteor.setTimeout(function() {
			test.notEqual(FeedCollection.find().count(), 0);
			onComplete();
		}, 5000);

		// reset config
		SocialMediaFeed.config({
			facebookIds: [],
			instagramIds: []
		});
	});
	Tinytest.add('Reset SocialMediaFeed returns an empty SocialMediaFeed', function (test) {
		SocialMediaFeed.reset();
		test.equal(FeedCollection.find().count(), 0);
	});
}

if (Meteor.isClient) {
}
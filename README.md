[![Build Status](https://travis-ci.org/nagelflorian/meteor-social-media-feed.svg)](https://travis-ci.org/nagelflorian/meteor-social-media-feed)
# Meteor - Social Media Feed

![Social media feed running with Masonry](https://cloud.githubusercontent.com/assets/7649376/8296111/afbc67d0-194c-11e5-8685-5d4ea9e0ebf2.png)

A social media feed for [Meteor](http://meteor.com). It aggregates content from all connected social media profiles and builds up a mosaic from the gathered content. This package doesn't come with a grid layout library like [Masonry](http://masonry.desandro.com) in order for you to decide on which one you'd like to use.

**Please follow the API Terms of Use of each connected social network.**

## Installation

``` sh
$ meteor add floriannagel:social-media-feed
```

## Getting Started

Create a 'setting.json' file at the root of your application with your api-keys like so:

```js
{
	"instagram_keys": {
		"client_id": "<CLIENTID>",
		"client_secret": "<CLIENTSECRET>",
		"access_token": "<ACCESSTOKEN>"
	},
	"facebook_keys": {
		"app_id": "<APPID>",
		"app_secret": "<APPSECRET>"
	},
	...
}
```

Next add profile Ids or hashtags using the `config` method on the server:

```js
SocialMediaFeed.config({
	facebookIds: ["123456789010"],
	instagramIds: ["12345678"],
	instagramTags: ["tbt"]
});
```

Include the template somewhere on the client:

```js
{{> SocialMediaFeed}}
```

Call `SocialMediaFeed.update();` on the server and run your app with `meteor --settings=settings.json` and the stream should appear within seconds.

## API

You can only access the API on the server. Wrap the functions in `Meteor.methods({...});` if you want them to be available on the client.

### Options

You can configure **Social Media Feed** using the following options:

```js
SocialMediaFeed.config({
	// log details to console
	log: false,
	// enable pagination of data
	pagination: false,

	facebookIds: [],
	instagramIds: [],
	instagramTags: [],
	twitterIds: [],
});
```

### Update

To gather content from the connected networks call:

```js
SocialMediaFeed.update();
```

To schedule automatic updates you can use something like [percolate:synced-cron](https://github.com/percolatestudio/meteor-synced-cron).

### Reset

To reset your feed and remove all data from the collection call:

```js
SocialMediaFeed.reset();
```

### Hide Content

You can hide content from the stream by calling:

```js
SocialMediaFeed.hideContent(network, contentId);
```
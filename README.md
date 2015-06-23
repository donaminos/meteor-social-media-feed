# DO NOT INSTALL - WORK IN PROGRESS

# Meteor - Social Media Feed

![Social media feed running with Masonry](https://cloud.githubusercontent.com/assets/7649376/8296111/afbc67d0-194c-11e5-8685-5d4ea9e0ebf2.png)

A social media feed for [Meteor](http://meteor.com). It aggregates content from all connected social media profiles and builds up a mosaic from the gathered content.

You can manually refresh the content or schedule a refresh using something like [percolate:synced-cron](https://github.com/percolatestudio/meteor-synced-cron).

This package doesn't come with a grid layout library like [Masonry](http://masonry.desandro.com) in order for you to decide on which one you'd like to use.

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
		"client_secret": "<CLIENTSECRET>"
	},
	"facebook_keys": {
		"app_id": "<APPID>",
		"app_secret": "<APPSECRET>"
	},
	...
}
```

Next add your Ids for each social network profile using the `config` method on the server:

```js
SocialMediaFeed.config({
	instagramIds: ["12345678"],
	facebookIds: ["123456789010"]
});
```

Include the template somewhere on the client:

```js
  {{> SocialMediaFeed}}
```

Call `SocialMediaFeed.update();` on the server and run your app with `meteor --settings=settings.json` and the stream should appear within seconds.


##License

The MIT License (MIT)

Copyright (c) 2015 Florian Nagel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
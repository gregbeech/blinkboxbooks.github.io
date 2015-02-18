---
layout: post
title: "Open-sourcing blinkbox Books"
author: gregbeech
---

One of the things I was keen on doing when I started working at [blinkbox Books][bbb] was developing in public so that people could see and hopefully contribute to what we were doing. We started with a _lot_ of legacy code and decided that before we did this we wanted to get the code into a state where we were fairly proud of it (or, at the very least, not embarrassed).

We didn't quite get there. Projects were underway to rewrite the catalogue, library and payment systems which were the last remaining bits of the legacy code in the platform; why we did those key components last is a story for another time. And, unfortunately, we're never going to get there because the company is being closed down after talks with Waterstones fell through.

Rather than let the code die with our GitHub:Enterprise server [we've put it all on GitHub][bbb-gh] in whatever state it was in, which includes all the warts and blemishes you'd expect from work-in-progress code, in the hope that people find it useful or interesting. It's all under the MIT license so you can do with it what you will.

There's not enough here to run a bookshop 'out of the box' because some of the platform components (which we referred to as 'v2') are incomplete and, in some cases, unstarted. We aren't going to put up the v1 versions we were using in production because, frankly, we never want to see them again, and you wouldn't want to use them.

So what's there?

## Ingestion

The ingestion system was affectionately known as 'Marvin' due to it containing all the metadata for the system in its planet-sized brain. This did the job of collecting ONIX, ePub and image files from publishers and storing it, while allowing changes to be made by content managers.

There's some interesting things here such as the multi-way merge of content from different sources based on time and precedence, and a variety of different components for processing ONIX, validating and encrypting ePub files, and storing files in the cloud.

What's here is our 'v4' ingestion system which was a few weeks away from being production ready, but complete enough to be trialled on a rig. There's more information on [its GitHub wiki][mv-wiki].


## Shop

Most things that weren't in the ingestion system were considered as being the shop, which was our vehicle for selling things. As previously noted, we were in the process of rewriting our catalogue to use Elasticsearch, and our payment and library systems to be more robust so what's up there is quite early and incomplete.

There are quite a number of core libraries for building web services and messaging components in Scala, and a few components that we used in our message bus to process events and commands flowing through the system. There's also a nice little mail templating component which we used for months before migrating to ExactTarget's API.

There's still a good few months work here to get a fully functioning shop out of the code, but you should be able to see some of our ideas.

## Auth

There are actually two auth servers up here. One's a Ruby version that we were using in production which does much of what you'd want an auth server to do (albeit with a rather awful OAuth 2.0-derived API which I've regretted every day since I designed it).

There's also a Scala version which was intended to work with blinkbox group's single sign-on system. Unfortunately this was nearing completion as the news came that our future was uncertain so this never reached production. There are a number of issues with this codebase too that we never fixed because it was parked.

## iOS App



## Android App



## Website




[bbb]: https://www.blinkboxbooks.com "blinkbox Books, RIP"
[bbb-gh]: https://github.com/blinkboxbooks "blinkboxbooks at GitHub"
[mv-wiki]: https://github.com/blinkboxbooks/Marvin/wiki "Marvin Wiki"
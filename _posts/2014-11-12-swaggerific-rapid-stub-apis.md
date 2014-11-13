---
layout: post
title: "Swaggerific: Rapid stub APIs"
author: jphastings
---

As our engineering team has expanded, keeping everyone informed as to how the APIs of our many microservices should be used has become harder. Documentation is clearly the key, but what format to use? We tried a couple of things, including wiki pages and markdown in the repo, but quality, consistency and maintenance of these docs left many of us coding to _implementation_, rather than spec. Yeah, that just sent a shiver down my spine too.

Enter stage left: [Swagger 2.0][1], a format for documenting RESTful APIs. It's brilliant for describing our APIs, but the necessary detail for complete documentation makes it tricky for humans to read. Documentation that's too verbose to use isn't really documentation...

Enter stage right: [Swaggerific][2], a tool we've developed that creates functioning stub HTTP services from swagger documentation so they react exactly as specified with fake, believable data.

Coding to implementation is intuitive, but it's risky because you have to make the assumption there are no bugs or deviations from the spec, but now our initial implementation _is the spec_ - we can have the best of both worlds.

## How it works

Swaggerific uses many of an inbound request's parameters to figure out which of the Swagger `paths` a consumer wants to trigger, then uses the `examples` and `schema` sections in the `response` object to generate realistic responses. The following are all taken into account:

* The HTTP **method** — `GET`, `POST`, `PUT` etc
* The request **path** — `/books/123` matches `/books/{isbn}` (with `isbn = 123`)
* The parameters' **format** — path, query, form data or header, a route will `400` if the request params don't fit.
* The `Accept-Language` header — generate fake data in that **locale** .
* The `Content-Type` header — must be in the route's **consumes** list.
* The `Accept` header — used to select a suitable example.
* The `X-Swaggerific-Respond-With` header — chooses the **response code**.
* The `X-Swaggerific-Respond-From` header - the preferred source for generating a response, _examples_ (default) or _schema_.

## Examples

It's significantly easier to just play with a swaggerific stub to get a feel for how it works (I'd recommend [using postman][3]). You can have a look at [swaggerific's own swagger doc][4] and interact with the stub at [meta.swaggerific.io][5]. To show a really simple example; this (trimmed) swagger doc:

{% highlight yaml %}
swagger: "2.0"
paths:
  /books/{isbn}:
    get:
      responses:
        200:
          examples:
            application/json: |
              {
                "isbn": "%{isbn}",
                "title": "The book title"
              }
{% endhighlight %}

responds on swaggerific like this:

{% highlight bash %}
# Acts as your docs describe
curl -v simple-demo.swaggerific.io/books/9780111222333

> GET /books/9780111222333 HTTP/1.1
> Host: simple-demo.swaggerific.io
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Swaggerific-Version: 0.12.1
< Content-Type: application/json
< X-Swaggerific-Hash: 39bea4b42
< Content-Length: 58
< 
{
  "isbn": "9780111222333",
  "title": "The book title"
}

# Reasonable RESTful responses for bad requests too
curl -H "Accept: text/plain" simple-demo.swaggerific.io/books/9780111222333

{
  "error": "no_example",
  "message": "The Swagger docs don't specify a suitable example for this route"
}
{% endhighlight %}

## Contributing

The source code for [Swaggerific][6] is on GitHub as is the code for [Genny][7], the library that generates fake data from JSON Schema. Questions, issues and pull requests are welcome, we also hang out on [#swaggerific][8] on freenode if you want to chat.

[1]: http://swagger.io "Swagger"
[2]: http://swaggerific.io "Swaggerific"
[3]: http://www.getpostman.com "Postman"
[4]: http://swaggerific.io/swag/meta "Swaggerific's swagger docs"
[5]: http://meta.swaggerific.io/ "Swaggerific's own stub service"
[6]: https://github.com/blinkboxbooks/swaggerific "Swaggerific on GitHub"
[7]: https://github.com/blinkboxbooks/genny "Genny on GitHub"
[8]: irc://freenode.net/%23swaggerific "#swaggerific on freenode"
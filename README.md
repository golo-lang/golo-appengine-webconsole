# Golo Web Console

This is the source code of the [Golo Web Console](http://golo-console.appspot.com) that runs on Google App Engine.

## Usage

You may run it locally using the AppEngine plugin:

    mvn appengine:devserver

You may alternatively use the Jetty plugin for live-reloads:

    mvn jetty:run

## License

    Copyright (C) 2013 Julien Ponge

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Running inside Docker

[Docker](http://docker.io/) is an increasingly popular container solution. We provide a Docker image
that can be built from this source code, see the `Dockerfile`.

Build and run cheatsheet:

    $ docker build -t jponge/docker-golo-console .
    $ docker run -p 18080:8080 -d jponge/docker-golo-console

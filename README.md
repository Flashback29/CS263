App Engine Java Application
Copyright (C) 2010-2012 Google Inc.

## Skeleton application for use with App Engine Java.

Requires [Apache Maven](http://maven.apache.org) 3.0 or greater, and JDK 6+ in order to run.

To build, run

    mvn package

Building will run the tests, but to explicitly run tests you can use the test target

    mvn test

To start the app, use the [App Engine Maven Plugin](http://code.google.com/p/appengine-maven-plugin/) that is already included in this demo.  Just run the command.

<<<<<<< HEAD
    mvn appengine:devserver

For further information, consult the [Java App Engine](https://developers.google.com/appengine/docs/java/overview) documentation.

To see all the available goals for the App Engine plugin, run

    mvn help:describe -Dplugin=appengine
=======
Next Goal:
Add a friend widget to see your friends' info

2014/11/16
Add a friend Menu to check friends' info

Next Goal:
receive friends' info (chatting msg,location info etc.) to the friend Menu

2014/11/30
Successfully add multi-users login and real-time track other users' login status via the People Nearby Widget

Next Goal:
Use the XMPP API to chat with people nearby and use the blubstore API to upload the images
>>>>>>> origin/master

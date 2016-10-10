9gag test by Rick Lee
===================

Resources
-------------
Server source code: [https://github.com/rickcodetalk/ninegag_server](https://github.com/rickcodetalk/ninegag_server)

Frontend source code: [https://github.com/rickcodetalk/ninegag](https://github.com/rickcodetalk/ninegag)

Demo URL: [http://9gagtest.rickcodetalk.net:3000](http://9gagtest.rickcodetalk.net:3000)

----------
Architecture
-------------
> Frontend - frontend side I use Angular2 as the main framework and couple other libraries/packages such as bootstrap 3.x for styling and responsive UI and angular2-moment for the creation date parsing. Others are more or less coming from Angular2 bundle. I also use angular-cli for building the web package.

> The implementation is pretty straight forward. Although originally I thought I don't even need a server, it seems Instagram doesn't allow using its JSONP endpoint APIs without authentication and the only valid JSON like I found out was the https://www.instagram.com/9gag/media, which will return fixed 20 recent posts in JSON format. After more testings, it also support simple query string ?max_id=<id>. Because of lacking JSONP API support and the CORS restriction, I decide to use node.js to relay the json data to frontend.
> 
> Backend - backend is node.js + express. The only purpose of that is to get rip of the browser CORS issue. It provides 1 get route for frontend to retrieve posts. The route has 1 parameter - maxId. If it's 0, it will return the recent 20 posts. If it's non-zero, it will grab 20 posts created right after the maxId. 
> I haven't implemented any caching mechanism due to time and api constraints that I couldn't think of a efficient way to do it.
 
----------
Major Challenge
-------------

 - I'm not that familiar with Instagram API and it's more restricted that I thought. It took me quite significant time to realise the restriction.
 - The iOS infinite scroll implementation was also the major blocker. I thought it's pretty easy and I made it work on computer and Android in no time, but iOS browsers has different event behaviors, which took 50%+ of my total time spending on the test to figure out the workaround.

----------


  





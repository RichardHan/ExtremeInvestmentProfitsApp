var Crawler = require("simplecrawler"),
    request = require("request"),
    url = require('url'),
    cheerio = require('cheerio'),
    crawlerSetup = require('./crawlerSetup.js');

var crawler = new Crawler(crawlerSetup.hostName, crawlerSetup.initialPath);
crawler.initialProtocol = crawlerSetup.initialProtocol;
crawler.needsAuth = crawlerSetup.needsAuth;
crawler.authUser = crawlerSetup.authUser;
crawler.authPass = crawlerSetup.authPass;
crawler.interval = crawlerSetup.interval;
crawler.initialPath = crawlerSetup.initialPath;
crawler.maxConcurrency = crawlerSetup.maxConcurrency;
crawler.maxDepth = crawlerSetup.maxDepth;
crawler.domainWhitelist = crawlerSetup.domainWhitelist;

crawler.cache = new Crawler.cache('D:/sites');

crawler.discoverResources = function (buffer, queueItem) {
    var $ = cheerio.load(buffer.toString("utf8"));
    return $("a[href]").map(function () {
        var _href = $(this).attr("href");
        if (_href.indexOf("html") > 0 && _href.indexOf("#comments") == -1) {
            return $(this).attr("href");
        }
    }).get();
};

crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
    console.log("%s (%d bytes) %s", queueItem.url, responseBuffer.length, response.headers['content-type']);
    //console.log(responseBuffer.toString());
});

crawler.start();
var Crawler = require("simplecrawler"),
    request = require("request"),
    url = require('url'),
    cheerio = require('cheerio'),
    crawlerSetup = require('./crawlerSetup.js'),
    fs = require('fs');

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

crawler.cache = new Crawler.cache('D:/tmp');

crawler.discoverResources = function (buffer, queueItem) {
    var $ = cheerio.load(buffer.toString("utf8"));
    return $("a[href]").map(function () {
        var _href = $(this).attr("href");
        if (_href.indexOf("html") > 0 && _href.indexOf("#comments") == -1 && _href.indexOf("?cid=") == -1) {
            return _href;
        }
    }).get();
};

crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {


    if (queueItem.url.indexOf(".html") > 0
        && queueItem.url.indexOf("index.html") == -1
        && queueItem.url.indexOf("about.html") == -1
        && queueItem.url.indexOf("archives.html") == -1) {
        var $ = cheerio.load(responseBuffer.toString("utf8"));
        var title = $('.date-header').text();
        title = title.replace(/\//g, '_');
        title = title.split('_')[2] + "_" + title.split('_')[0] + "_" + title.split('_')[1];

        console.log("%s (%d bytes) %s %s ", queueItem.url, responseBuffer.length, response.headers['content-type'], title);

        var html = $('.entry').html();
        var html = "<h1>" + queueItem.url + "</h1>" + html;

        var _10kStr = $($('strong')[0]).text();
        var _10k = _10kStr.substr(_10kStr.lastIndexOf('$')).replace('>', '').replace(/,/g,'');
        var _20kStr = $($('strong')[1]).text();
        var _20k = _20kStr.substr(_20kStr.lastIndexOf('$')).replace('>', '').replace(/,/g,'');

        var writeLine = _10k + "," + _20k + "," + queueItem.url + "," + title + "," + responseBuffer.length;

        fs.appendFile('D:/tmp/index.csv', writeLine + '\r\n', function (err) {
            if (err) {
                fs.appendFile('D:/tmp/error.txt', queueItem.url + '\r\n', function (err) {
                    return;
                });
                return console.log(err);
            }
        });

        fs.writeFile("D:/tmp/" + title + ".html", html, function (err) {
            if (err) {
                fs.appendFile('D:/tmp/error.txt', queueItem.url + '\r\n', function (err) {
                    return;
                });
                return console.log(err);
            }
        });
    }
    else {
        console.log("%s (%d bytes) %s", queueItem.url, responseBuffer.length, response.headers['content-type']);
    }
});

crawler.start();
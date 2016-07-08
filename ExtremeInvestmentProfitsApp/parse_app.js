var Crawler = require("simplecrawler"),
    request = require("request"),
    url = require('url'),
    cheerio = require('cheerio'),
    indexBuilder = require('./IndexBuilder.js'),
    fs = require('fs');

fs.readdir("D:/tmp", function (err, files) {
    if (!err)
        for (var i in files) {
            if (files[i].indexOf(".html") > 0) {
                console.log(files[i]);
                //var buffer = fs.readFile('D:/tmp' + files[i]);
                var buffer = fs.readFile('D:/tmp/' + files[i], function (err, data) {
                    if (err) throw err;
                    indexBuilder(data.toString("utf8"));
                    //console.log(data);
                });
            }
        }
    else
        throw err;
});

function BuildIndexFile() {


}
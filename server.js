// imports
var http = require('http');
var fs = require('fs');
var url = require('url');

// script options
var libPath = './';
var queryParams = {
        page: 'page',
        pageSize: 'count'
};
var requestedPage = 1;
var pageSize = 10;

console.log("starting server...");

var server = http.createServer(function (req, res) {
    var q = url.parse(req.url, true).query;
    var fileRequest = req.url.match(/\/(.*\.json)/);

    console.log("request: url %s, page # %s", req.url, q.page);

    if (fileRequest) {
        var fileName = fileRequest[1];

        try {
            var fileStats = fs.lstatSync(libPath + fileName);
            var fileBody = fs.readFileSync(libPath + fileName);
        }
        // exit with 404 if the file doesn't exist
        catch (e) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(fileName + ": file not found");
            return
        }

        var params = Object.keys(q);

        // exit with 200 if no params, and display the entire json
        if (params.length < 1) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(fileBody);
            return
        }

        var json = JSON.parse(fileBody);
        var totalResults = json.length;

        if (params.indexOf(queryParams.page) > -1) requestedPage = parseInt(q[queryParams.page])
        if (params.indexOf(queryParams.pageSize) > -1) pageSize = parseInt(q[queryParams.pageSize])

        var fullPages = Math.floor(totalResults/pageSize);
        if (fullPages >= 1) {
            var remainder = totalResults % (fullPages * pageSize);
            var offset = pageSize * (requestedPage - 1);
            var result = json.slice(offset, offset + pageSize);

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
            return
        }

        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("something went wrong");

    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(req.url + " isn't a json file :(");
    }
}).listen(3000);

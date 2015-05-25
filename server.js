// imports
var http = require('http');
var fs = require('fs');
var url = require('url');

// script options
var libPath = './';
var port = 3000;
var queryParams = {
        page: 'page',
        pageSize: 'count'
};
var defaults = {
        reqPage: 1,
        pageSize: 10
};

console.log("starting server...");

var server = http.createServer(function (req, res) {
    var q = url.parse(req.url, true).query;
    var fileRequest = req.url.match(/\/(.*\.json)(?:$|\?)/);

    console.log("request: url %s", req.url);

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

        var reqPage = params.indexOf(queryParams.page) > -1 ? parseInt(q[queryParams.page]) : defaults.reqPage;
        var pageSize = params.indexOf(queryParams.pageSize) > -1 ? parseInt(q[queryParams.pageSize]) : defaults.pageSize;

        var fullPages = Math.ceil(totalResults/pageSize);
        if (fullPages >= 1) {
            var offset = pageSize * (reqPage - 1);
            var paginatedResult = json.slice(offset, offset + pageSize);

            var tmp = {
                total: totalResults,
                next: null,
                prev: null,
                results: []
            };
            for (var i = 0; i < paginatedResult.length; i++) {
                tmp.results.push(paginatedResult[i]);
            };

            var results = JSON.stringify(tmp, null, 4);

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(results);
            return
        }

        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("something went wrong");

    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(req.url + " isn't a json file :(");
    }
}).listen(port);

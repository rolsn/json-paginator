// imports
var http = require('http');
var fs = require('fs');
var url = require('url');

// script options
var libPath = './';

console.log("starting server...");

var server = http.createServer(function (req, res) {
    var q = url.parse(req.url, true).query;
    var fileRequest = req.url.match(/\/(.*\.json$)/);

    console.log("request: url %s, page # %s", req.url, q.page);

    /*
     * remember: fileRequest is false if it doesn't match the json regex
     */

    if (fileRequest) {
        var fileName = fileRequest[1];

        try {
            fileStats = fs.lstatSync(libPath + fileName);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(fs.readFileSync(libPath + fileName));
        }
        catch (e) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(fileName + ": file not found");
            return
        }

    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(req.url + " isn't a json file :(");
    }
}).listen(3000);

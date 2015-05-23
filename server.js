// imports
var http = require('http');
var fs = require('fs');
var url = require('url');

// script options
var libPath = './';

console.log("starting server...");

http.createServer(function (req, res) {
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
            console.log(e);
        }
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(fs.readFileSync('./index.html'));
    }
}).listen(3000);

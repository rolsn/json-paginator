var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function (req, res) {
    var libPath = 'public/lib/';
    var q = url.parse(req.url, true).query;
    var fileRequest = req.url.match(/\/(.*\.js)/);

    console.log("request: url %s, page # %s", req.url, q.page);

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

    // the whole db
    if (req.url == '/books') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(fs.readFileSync('./public/db.json'));
    }

    // specific page numbers (with 4 being a 404) and index.html otherwise
    if (q.page == '1') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(fs.readFileSync('./public/p1.js'));
    }
    else if (q.page == '2') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(fs.readFileSync('./public/p2.js'));
    }
    else if (q.page == '3') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(fs.readFileSync('./public/p3.js'));
    }
    else if (q.page == '4') {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("404 :(");
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(fs.readFileSync('./public/index.html'));
    }
}).listen(3000);

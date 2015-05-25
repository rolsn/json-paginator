# json-paginator

## Purpose
This is a simple node.js application whose purpose is to serve JSON files like any normal web server would.
The difference is it will also paginate the JSON into any combination of page # or count size.

## Use
$ cd dir; nodejs server.js

By default, any .json files within the current directory will be served. The entire JSON file will
be returned if there are no URL parameters; if 'page' or 'count' are detected, the results will be
paginated according to these options. The directory it looks in is set by the libPath variable.

If you prefer to use something besides 'page' or 'count', e.g. simply 'p', this can be changed in the
queryParams object.

If the results are paginated, the actual results will be in the results array. Also included
are the total number of results and prev/next links.

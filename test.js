// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
 
// Configure the HTTP server to print Hello World! to all requests.
var server = http.createServer(function (request, response) {
    fs.readFile("index.html", function (error, pgResp) {
            if (error) {
                response.writeHead(404);
                response.write('Contents you are looking are Not Found');
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(pgResp);
            }
             
            response.end();
    });
});
 
// Listen on port 8080
server.listen(8080);
 
console.log('Server available at http://localhost:8080/');

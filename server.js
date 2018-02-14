const http = require('http');
const fs = require('fs');
// const port = 24606;
const port = 8080;
const server = http.createServer();

server.on('request', (req, res) => {
    switch (req.url) {
        case '/':
            if (req.method === 'GET') {
                returnFile('form.html', 'text/html', res)
            } else if (req.method === 'POST') {

            }

            break;
        case '/style.css':
            returnFile('style.css', 'text/css', res);
            break;
        case '/form.js':
            returnFile('form.js', 'application/javascript', res);
            break;
        default:
            res.writeHead(404);
            res.end();
    }
})

function returnFile(fileName, mimeType, res) {
    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.log(`err: ${err}`);
            res.writeHead(500, 'something wrong');
            res.end();
            return;
        }

        res.writeHead(200, {
            "Content-Type": mimeType
        });

        res.write(data);
        res.end();
    });
}

server.listen(port);
console.log(`Listening on port ${port}`);
"use strict";

const http = require('http');
const fs = require('fs');
const qs = require('querystring');

// const port = 24606;
const port = 8080;
const dataDir = __dirname + '/data/';
const usersFile = dataDir + 'users.json';

const server = http.createServer();

server.on('request', (req, res) => {
    switch (req.url) {
        case '/':
            if (req.method === 'GET') {
                returnFile('form.html', 'text/html', res)
            } else if (req.method === 'POST') {
                handlePost(req, res);
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
});

function handlePost(req, res) {
    let body = '';

    req.on('data', (data) => {
        body += data.toString();
    });

    req.on('end', () => {
        let user = parseUser(qs.parse(body));
        let users = [];
        
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        } else {
            try {
                let content = fs.readFileSync(usersFile);
                users = JSON.parse(content);
            } catch (err) {
                // do nothing
            }
        }

        users.push(user);

        fs.writeFile(usersFile, JSON.stringify(users), function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The user was saved!");
        });

        returnFile('form.html', 'text/html', res);
    });
}

// turns { email: 1, email1: 2, email2: 3 }
// into { emails: [1, 2, 3] }
function parseUser(user) {
    let emails = [];
    let newUser = {};
    
    for (let key in user) {
        let value = user[key];
        
        if (key.startsWith('email')) {
            emails.push(value);
        } else {
            newUser[key] = value;
        }
    }

    newUser.emails = emails;
    return newUser;
}

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
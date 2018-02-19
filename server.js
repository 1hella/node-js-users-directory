"use strict";

const http = require('http');
const fs = require('fs');
const qs = require('querystring');

// const port = 24606;
const port = 8080;
const dataDir = __dirname + '/data/';
const usersFile = dataDir + 'users.json';

const HTML_MIME_TYPE = 'text/html';
const JSON_MIME_TYPE = 'application/json';
const CSS_MIME_TYPE = 'text/css';
const JS_MIME_TYPE = 'application/javascript';

const server = http.createServer();

server.on('request', (req, res) => {
    switch (req.url) {
        case '/':
            if (req.method === 'GET') {
                returnFile('form.html', HTML_MIME_TYPE, res)
            } else if (req.method === 'POST') {
                handlePost(req, res);
            }

            break;
        case '/users.json':
            returnFile('data/users.json', JSON_MIME_TYPE, res, () => {
                res.writeHead(200, {
                    "Content-Type": JSON_MIME_TYPE
                });

                res.write('[]');
                res.end();
            });
            break;
        case '/users.html':
            returnUsers(res);
            break;
        case '/style.css':
            returnFile('style.css', CSS_MIME_TYPE, res);
            break;
        case '/form.js':
            returnFile('form.js', JS_MIME_TYPE, res);
            break;
        default:
            res.writeHead(404);
            res.end();
    }
});

function returnUsers(res) {
    res.writeHead(200, {
        'Content-Type': HTML_MIME_TYPE
    });

    let users = getUsers();
    let html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <link rel="stylesheet" href="style.css">
                    <title>Users</title>
                </head>
                <body>
                    <nav>
                        <a href="/">Add User</a>
                        <a href="/users.html">List Users</a>
                        <a href="/users.json">Users.json</a>
                    </nav>
                    <h1>List Users</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Birthday</th>
                                <th>Emails</th>
                            </tr>
                        </thead>
                        <tbody>`;

    for (let user of users) {
        html += `<tr>
                <td>${user.firstname}</td>
                <td>${user.lastname}</td>
                <td>${user.birthday}</td>
                <td>`;

        for (let email of user.emails) {
            html += email + '<br>';
        }

        html += `</td>
                </tr>`;
    }

    html += `</tbody>
                    </table>
                    
                </body>
                </html>`;
    res.write(html);
    res.end();
}

function handlePost(req, res) {
    let body = '';

    req.on('data', (data) => {
        body += data.toString();
    });

    req.on('end', () => {
        let user = parseUser(qs.parse(body));
        let users = getUsers();

        users.push(user);

        fs.writeFile(usersFile, JSON.stringify(users), function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The user was saved!");
        });

        returnFile('form.html', HTML_MIME_TYPE, res);
    });
}

function getUsers() {
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

    return users;
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

function returnFile(fileName, mimeType, res, errCallback) {
    fs.readFile(fileName, (err, data) => {
        if (err) {
            if (errCallback) {
                errCallback();
            } else {
                console.log(`err: ${err}`);
                res.writeHead(500, 'something wrong');
                res.end();
            }
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
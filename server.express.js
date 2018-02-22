"use strict";

const fs = require('fs');
const qs = require('querystring');
const url = require('url');
const express = require('express');

const port = 24606;
const dataDir = __dirname + '/data/';
const usersFile = dataDir + 'users.json';

const HTML_MIME_TYPE = 'text/html';
const JSON_MIME_TYPE = 'application/json';

const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    returnFile('form.html', HTML_MIME_TYPE, res)
});

app.post('/', (req, res) => {
    handlePost(req, res);
});

app.get('/users.json', (req, res) => {
    returnFile('data/users.json', JSON_MIME_TYPE, res, () => {
        res.writeHead(200, {
            "Content-Type": JSON_MIME_TYPE
        });

        res.write('[]');
        res.end();
    });
});

app.get('/users.html', (req, res) => {
    returnUsers(res);
});

app.delete('/users', (req, res) => {
    let urlObj = url.parse(req.url, true);

    if (!urlObj.query.u) {
        saveUsers([]);
    } else {
        let index = Number(urlObj.query.u);
        let users = getUsers(index);
        users.splice(index, 1);
        saveUsers(users);
    }

    res.writeHead(200);
    res.end();
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
                    <script src="users.js"></script>
                    <title>Users</title>
                </head>
                <body>
                    <nav class="mobile-title">
                        <a href="./">Stephen's User Directory</a>
                    </nav>
                    <nav>
                        <a href="./" class="title">Stephen's User Directory</a>
                        <a href="./">Add User</a>
                        <a href="./users.html" class="active">Users</a>
                        <a href="./about.html">About</a>
                        <a href="./users.json">Users.json</a>
                    </nav>
                    <main>
                    <section>
                    <h2>Users</h2>`;

    if (users.length > 0) {
        html += `<div id="list">
                    <div id="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Birthday</th>
                                <th>Email(s)</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>`;

        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            html += `<tr>
                <td>${user.firstname}</td>
                <td>${user.lastname}</td>
                <td>${user.birthday}</td>
                <td>`;

            for (let email of user.emails) {
                html += email + '<br>';
            }

            html += `</td>
                <td><a href="#" class="delete" data-index="${i}">X</a></td>
                </tr>`;
        }

        html += `</tbody>
                    </table>
                    </div>
                <button class="delete">Delete all</button>
                </div>`
    } else {
        html += `<h3>No users. Add some <a href="./">here</a>!</h3>`;
    }

    html += `</section>
                </main>
                <footer>Copyright &copy; 2018 <a target="_blank" href="//twitter.com/wanhella">Stephen Wanhella</a></footer>
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
        saveUsers(users);

        returnFile('form.html', HTML_MIME_TYPE, res);
    });
}

function saveUsers(users) {
    fs.writeFile(usersFile, JSON.stringify(users), (err) => {
        if (err) {
            return console.log(err);
        }

        console.log("The user was saved!");
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

        if (key.startsWith('email') && value !== "") {
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

app.listen(port);
console.log(`Listening on port ${port}`);
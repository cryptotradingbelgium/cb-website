'use strict';

let express  = require('express');
let path = require('path');
let morgan = require('morgan');
let app = express();

let request = require('request');
let config = require('./config');

const port = process.env.PORT || 3000;

const VIEWS_DIR = path.join(__dirname, '/views');
const PUBLIC_DIR = path.join(__dirname, '/public');

app.use(morgan('dev'));
app.use(express.static(PUBLIC_DIR));

let bodyParser  =    require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, 'about.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, 'contact.html'));
});
app.get('/sitemap', (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, 'sitemap.html'));
});

app.get('/sw.js', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'sw.js'));
});

app.post('/join', (req, res) => {
    let email = req.body.email;

    var emailParam = `email=${email}`;
    var tokenParam = `token=${config.slack.token}`;

    var url = `https://slack.com/api/users.admin.invite?${tokenParam}&${emailParam}`;

    request.post(url, (error, response) => {
        if (error) {
            if (res.statusCode !== 200) {
                console.log('error', error);
                res.status(500).send({error: 'Error sending invitation email'});
            }
        }
        if (response.body.ok){
            res.send(200, 'Check your email!');
        } else {
            res.status(500).send({error: 'Something went wrong!'});
        }
    });
    res.sendFile(path.join(VIEWS_DIR, 'index.html'));
});

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(VIEWS_DIR, '404.html'));
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

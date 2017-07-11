'use strict';

let express     = require('express');
let path        = require('path');
let morgan      = require('morgan');
let app         = express();

const port      = process.env.PORT || 4000;

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views', 'about.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '/views', 'contact.html'));
});
app.get('/sitemap', (req, res) => {
    res.sendFile(path.join(__dirname, '/views', 'sitemap.html'));
});

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views', '404.html'));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

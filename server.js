'use strict';

let express     = require('express');
let path        = require('path');
let morgan      = require('morgan');
let app         = express();

let request     =    require('request');
let config      =   require('./config');

const port      = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '/public')));

/*
     BodyParser is middleware that intercepts the request and parsing our passed data into JSON.
* */
let bodyParser  =    require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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

app.get('/sw.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'sw.js'));
});


app.post('/join', (req, res) => {

    // By using bodyParser we can easily extract variables from requests
    var email = req.body.email;

    var email_param = '&email=' + email;
    var token_param = 'token=' + config.slack.token;

    var url = 'https://slack.com/api/users.admin.invite?'+ token_param + email_param

    request.post(url,function(error,response) {
        if (error) {
            if (res.statusCode !== 200){
                console.log('error')
                console.log(error)
            } //etc
        }

        if (response.body.ok){
            res.send(200, 'Check your email!')
        }else{
            res.send(500, 'Something went wrong!')
        }

    });

    res.sendFile(path.join(__dirname, '/views', '404.html'));
});

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views', '404.html'));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

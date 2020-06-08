var express = require('express')
var cors = require('cors')
const fs = require('fs');

const dbClient = require('./mongoClient')

var app = express()

app.use(cors())

// read response body
app.use(express.json());

let rawdata = fs.readFileSync('data.json');
let records = JSON.parse(rawdata);

// test service is up & running
app.get("/ping", function (req, reply, next) {
    reply.send("pong");
});

// add new books
app.post('/booklist/', function (req, reply, next) {

    if (req.body != undefined && req.body.hasOwnProperty("category") && req.body.hasOwnProperty("data")) {

        dbClient.insertBook(req.body.category, req.body.data).then(data => {
            reply.send({ service: 'bookstore_v1', data: data })

        });
    }
});

// get books
app.get('/booklist/:interest', function (req, reply, next) {

    if (req.params.interest != undefined) {

        let categories = req.params.interest.split(",");

        dbClient.extractBook(categories, {}).then(data => {
            reply.send({ service: 'bookstore_v1', data: data })

        });
    } else {
        reply.send({ service: 'bookstore_v1', data: records })

    }
    // reply.send({ service: 'bookstore_v1', data: records })
})

app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000')
})
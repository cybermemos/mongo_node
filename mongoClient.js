
const assert = require('assert');

const MongoClient = require('mongodb').MongoClient;
// This should be your connection string
const uri = "mongodb+srv://USER:PASSWORD@cluster0-ziubz.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


exports.extractBook = function (categories, filter) {
    let THIS = this;

    let finalResutl = {};

    return new Promise((resolve, reject) => {
        if (categories != undefined && categories.length > 0) {

            let promiseArray = [];

            categories.forEach(category => {
                promiseArray.push(THIS.retriveBook(category));
            });

            Promise.all(promiseArray).then((values) => {
                console.log(values);
                resolve(values)
            });
        }

    });

}

exports.retriveBook = function (category, filter) {

    let THIS = this;
    let finalResult={};

    return new Promise((resolve, reject) => {

        client.connect(err => {
            const collection = client.db("booklist").collection(category);
            // perform actions on the collection object
            console.log("Connected");
            

            THIS.findDocuments(collection, filter, function (result) {
                finalResult[category] = result
                resolve(finalResult)
            });

        });
    });
}


exports.insertBook = function (category, bookDetails) {
    let THIS = this;
    return new Promise((resolve, reject) => {

        client.connect(err => {
            const collection = client.db("booklist").collection(category);
            // perform actions on the collection object
            console.log("Connected")
            THIS.insertDocuments(collection, bookDetails, function (result) {
                resolve(result)
            });

        });
    });
}


exports.insertDocuments = function (collection, data, callback) {
    // Get the documents collection
    // const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        data
    ], function (err, result) {
        assert.equal(err, null);
        console.log("Inserted documents into the collection");
        callback(result);
    });
}

exports.findDocuments = function (collection, filter = {}, callback) {
    // Get the documents collection
    // Find some documents
    collection.find(filter).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
}



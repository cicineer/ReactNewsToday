var MongoClient = require('mongodb').MongoClient

var dbUrlFromSetting = ''
var dbPortNumberFromSetting = ''
var dbNameFromSetting = '   '

function _connectDB(callback) {
    // default url
    var url = ''
    if (dbUrlFromSetting === '' || dbPortNumberFromSetting === '' || dbNameFromSetting === '') {
        url = 'mongoDb://127.0.0.1:27017/student'
    } else {
        url = 'mongoDb://' + dbUrlFromSetting + ':' + dbPortNumberFromSetting + '/' + dbNameFromSetting
    }
    MongoClient.connect(url, function (err, db) {
        if (err) {
            throw 'Connect to database failed..'
        }
        callback(err, db)
    })
}

exports.settings = function (dbUrl, dbPortNumber, dbName) {
    if (arguments.length !== 3) {
        throw 'Arguments number must be 3'
    }
    dbUrlFromSetting = dbUrl
    dbPortNumberFromSetting = parseInt(dbPortNumber)
    dbNameFromSetting = dbName
}

exports.getAllRecordCount = function (collectionName, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).find({}).count().then(function (count) {
            callback(err, count)
        })
    })
}

exports.getRecordCount = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        console.log(dbUrlFromSetting)
        console.log(dbPortNumberFromSetting)
        console.log(dbNameFromSetting)
        db.collection(collectionName).find(json).count().then(function (count) {
            console.log(count)
            callback(err, count)
        })
    })
}

exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).insertOne(json, function (err, result) {
            callback(err, result)
            db.close()
        })
    })
}

exports.findAll = function (collectionName, callback) {
    var result = [];
    _connectDB(function (err, db) {
        var cursor = db.collection(collectionName).find({})
        // the first parameter is the iterator
        // the second is to handle when finishing the iteration
        cursor.forEach(function (doc) {
            result.push(doc)
        }, function () {
            callback(null, result)
            db.close()
        })
    })
}

exports.find = function (collectionName, json, callback) {
    // the result of all docs
    var result = [];
    if (JSON.stringify(json) === '{}')
        throw 'Query cannot be empty'
    _connectDB(function (err, db) {
        var cursor = db.collection(collectionName).find(json)
        // the first parameter is the iterator
        // the second is to handle when finishing the iteration
        cursor.forEach(function (doc) {
            result.push(doc)
        }, function () {
            callback(null, result)
            db.close()
        })
    })
}

exports.page = function (collectionName, json, args, callback) {

    var result = [];

    // the number of Records to be ignored
    // pageAmount: items the user wanna get per page
    // page: which page the user wanna get
    // currentPage: the real page user wanna get because skipAmount will skip items that he wanna see on this page
    // skipAmount: items skipped, also it is which page the user wanna see
    var currentPage = args.page - 1;
    var skipAmount = args.pageAmount * (args.page - 1)

    _connectDB(function (err, db) {
        // .limit() items per page
        var cursor = db.collection(collectionName).find(json).limit(args.pageAmount).skip(skipAmount)

        // var totalNumber = db.collection(collectionName).find(json).count()
        cursor.forEach(function (doc) {
            result.push(doc)
        }, function () {
            callback(null, result)
            db.close()
        })
    })
}

exports.findOneAndUpdate = function (collectionName, json, updateData, callback) {
    _connectDB(function (err, db) {
        var collection = db.collection(collectionName)
        collection.findOneAndUpdate(json, {$push: updateData}, {
            upsert: true
        }, function (err, result) {
            callback(err, result)
            db.close()
        })
    })
}

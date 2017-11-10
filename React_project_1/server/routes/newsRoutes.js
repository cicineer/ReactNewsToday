const request = require('request')
const newsSource = require('../source/newsSource')

const getNews = function (source, res, callback) {
    request(source, (err, response, body) => {
        if (body !== undefined && body !== null) {
            callback(body)
        }
        else {
            callback('-1')
            res.send({
                status: -1,
                msg: 'Seems your network is slow or you are not connected to Internet'
            })
        }
    })
}

exports.news = {
    natureAndSociety: function (req, res, db) {
        let news = []
        getNews(newsSource.natureAndSociety.cnn, res, (result) => {
            if (result !== '-1') {
                news = (JSON.parse(result)).articles
                getNews(newsSource.natureAndSociety.nationalGeographics, res, function (result) {
                    if (result !== '-1') {
                        (JSON.parse(result)).articles.map((item) => {
                            news.push(item)
                        })
                        db.find('news', {
                            likedUsers: req.session.username,
                            type: 'natureAndSociety'
                        }, function (err, result) {
                            news.map((itemFromInternet) => {
                                result.map((itemFromDb) => {
                                    if(itemFromInternet.title === itemFromDb.title)
                                        itemFromInternet.isLikedByCurrentUser = true
                                })
                            })
                            res.send(news)
                        })
                    }
                })
            }
        })
    },
    technology: function (req, res, db) {
        let news = []
        getNews(newsSource.tech.hackerNews, res, (result) => {
            if (result !== '-1') {
                news = (JSON.parse(result)).articles
                getNews(newsSource.tech.techcrunch, res, (result) => {
                    if (result !== '-1') {
                        (JSON.parse(result)).articles.map((item, key) => news.push(item))
                        getNews(newsSource.tech.techradar, res, (result) => {
                            if (result !== '-1')
                                (JSON.parse(result)).articles.map((item, key) => news.push(item))
                            res.send(news)
                        })
                    }
                })
            }
        })
    },
    sport: function (req, res, db) {
        let news = []
        getNews(newsSource.sport.foxSport, res, (result) => {
            if (result !== '-1') {
                news = (JSON.parse(result)).articles
                getNews(newsSource.sport.espn, res, (result) => {
                    if (result !== '-1') {
                        (JSON.parse(result)).articles.map((item, key) => news.push(item))
                        getNews(newsSource.sport.bbcSport, res, (result) => {
                            if (result !== '-1')
                                (JSON.parse(result)).articles.map((item, key) => news.push(item))
                            res.send(news)
                        })
                    }
                })
            }
        })
    },
    entertainment: function (req, res, db) {
        let news = []
        getNews(newsSource.entertainment.reddit, res, (result) => {
            if (result !== '-1') {
                news = (JSON.parse(result)).articles
                getNews(newsSource.entertainment.entertainmentDaily, res, function (result) {
                    if (result !== '-1') {
                        (JSON.parse(result)).articles.map((item) => {
                            news.push(item)
                        })
                        res.send(news)
                    }
                })
            }
        })
    }
}
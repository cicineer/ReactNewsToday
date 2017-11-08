const request = require('request')
const newsSource = require('../source/newsSource')

exports.news = {
    natureAndSociety: function (req, res) {
        let news = []
        request(newsSource.natureAndSociety.cnn, (err, response, body) => {
            news = (JSON.parse(body)).articles
            request(newsSource.natureAndSociety.nationalGeographics, (err, response, body) => {
                (JSON.parse(body)).articles.map((item, key) => {
                    news.push(item)
                })
                res.send(news)
            })
        })
    },
    technology: function (req, res) {
        let news = []
        request(newsSource.tech.hackerNews, (err, response, body) => {
            console.log(body)
            news = (JSON.parse(body)).articles
            request(newsSource.tech.techcrunch, (err, response, body) => {
                (JSON.parse(body)).articles.map((item, key) => {
                    news.push(item)
                })
                news.push()
                request(newsSource.tech.techradar, (err, response, body) => {
                    (JSON.parse(body)).articles.map((item, key) => {
                        news.push(item)
                    })
                    res.send(news)
                })
            })
        })
    },
    sport: function (req, res) {
        let news = []
        request(newsSource.sport.bbcSport, (err, response, body) => {
            news = (JSON.parse(body)).articles
            console.log(news)
            request(newsSource.sport.espn, (err, response, body) => {
                ((JSON.parse(body)).articles).map((item, key) => {
                    news.push(item)
                })
                request(newsSource.sport.foxSport, (err, response, body) => {
                    ((JSON.parse(body)).articles).map((item, key) => {
                        news.push(item)
                    })
                    res.send(news)
                })
            })
        })
    },
    entertainment: function(req, res) {
        let news = []
        request(newsSource.entertainment.entertainmentDaily, (err, response, body) => {
            news = (JSON.parse(body)).articles
            request(newsSource.entertainment.reddit, (err, response, body) => {
                ((JSON.parse(body)).articles).map((item, key) => {
                    news.push(item)
                })
                res.send(news)
            })
        })
    }
}
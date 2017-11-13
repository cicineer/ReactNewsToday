const express = require('express')
const app = express()
const db = require('./db/db')
const session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')
const md5 = require('md5')
const urlencoded = bodyParser.urlencoded({extended: false})
const MongoStore = require('connect-mongo')(session);
const newsRoutes = require('./routes/newsRoutes')
const userRoutes = require('./routes/userRoutes')
// save the session in MongoDB database
const mongoStoreInstance = new MongoStore({
    url: 'mongodb://localhost/ReactNews'
})

app.use(session({
        // save the session in MongoDB database
        store: mongoStoreInstance,
        secret: '~~~',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 30 * 60 * 1000 * 24,
            secure: false,
            httpOnly: false,
        }
    })
)

app.use(cors({credentials: true, origin: true}))

app.use(bodyParser.json())

app.get('/', (req, res) => res.send({isLogin: req.session.login, username: req.session.username}))

app.post('/user/dislikeNews', (req, res) => userRoutes.dislike(req, res, db))

app.post('/user/likeNews', (req, res) => userRoutes.like(req, res, db))

app.post('/register', (req, res) => {userRoutes.register(req, res, db, md5)})

app.post('/login', (req, res) => userRoutes.login(req, res, db, md5))

app.post('/logout', (req, res) => userRoutes.logout(req, res, mongoStoreInstance))

app.get('/news/natureAndSociety', (req, res) => newsRoutes.news.natureAndSociety(req, res, db))

app.get('/news/technology', (req, res) => newsRoutes.news.technology(req, res, db))

app.get('/news/sport', (req, res) => newsRoutes.news.sport(req, res, db))

app.get('/news/entertainment', (req, res) => newsRoutes.news.entertainment(req, res, db))

app.listen('3000', function () {
    db.settings('127.0.0.1', '27017', 'ReactNews')
})
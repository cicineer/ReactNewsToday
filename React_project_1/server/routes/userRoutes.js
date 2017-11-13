module.exports = {
    login: (req, res, db, md5) => {
        const username = req.body.formData.userName
        const password = req.body.formData.password
        db.find('user_table', {username: username}, function (err, result) {
            if (result.length !== 0) {
                const user = result[0]
                const passwordFromDb = user.password
                if (md5(password) === passwordFromDb) {
                    req.session.login = '1'
                    req.session.username = username
                    // 登陆之后要根据用户当前所在的type新闻页将数据库
                    // 中相对应的新闻推过去，这样可以更新用户喜欢的新闻，把桃心点红
                    db.findAll('news', (err, result) => {
                        res.send({
                            status: 1,
                            msg: 'Welcome ' + username,
                            newsFromDb: result,
                            username: req.session.username
                        })
                    })
                } else if (md5(password) !== passwordFromDb) {
                    res.send({status: -1, msg: 'password not correct'})
                }
            } else {
                res.send({status: -2, msg: 'user not exist'})
            }
        })
    },
    register: (req, res, db, md5) => {
        const username = req.body.formData.userName
        const password = md5(req.body.formData.password)
        db.find('user_table', {username: username}, function (err, result) {
            if (result.length !== 0) {
                res.send({status: -1, msg: username + ' has already existed'})
                res.end()
                return
            }
            db.insertOne('user_table', {username: username, password: password}, function (err, result) {
                if (err) {
                    res.send(err)
                    return
                }
                req.session.login = '1'
                req.session.username = username
                res.send({status: 1, msg: 'Welcome ' + username})
            })
        })
    },
    logout: (req, res, mongoStoreInstance) => {
        mongoStoreInstance.destroy(req.session.id, function (err) {
            // 1 stands for cleared in the client
            res.send('1')
        })
    },
    // three values will be returned
    // 1. insert the first record in the database
    // 2. the news has been liked, you are pushed into the news liked user collection
    // 3. You are the first one to like this piece of news
    like: (req, res, db) => {
        if (req.session.login !== '1')
            res.send({status: -1, msg: 'You are not logged in'})
        else {
            const newsItem = req.body.data.newsItem
            const newsType = req.body.data.newsType
            // 如果like这个新闻，那么就要判断这个新闻在所对应的类别是不是已经在数据库中
            // 如果没有在就添加进去
            // 如果在就推进对应的类别中去
            db.findAll('news', (error, result) => {
                if (result.length === 0) {
                    newsItem.likedUsers = [req.session.username]
                    newsItem.type = newsType
                    db.insertOne('news', newsItem, (err, result) => {
                        res.send({
                            status: 1,
                            msg: 'insert the first record in the database'
                        })
                    })
                } else {
                    // 判断集合中有没有这条新闻
                    let exist = false
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].title === newsItem.title) {
                            // db.insert
                            exist = true
                            break
                        }
                    }
                    // 如果集合中有这条新闻记录了，那么就将当前用户push到这条新闻的likedUser里去
                    if (exist) {
                        db.findOneAndPush('news', {title: newsItem.title}, {likedUsers: req.session.username}, function (err, result) {
                            db.find('news', {title: newsItem.title}, (err, result) => {
                                res.send({
                                    status: 2,
                                    addedObj: result,
                                    msg: 'the news has been liked, you are pushed into the news liked user collection'
                                })
                            })
                        })
                        // 没有这条新闻那么就在news这个集合中加入这个news并且把当前点赞的user推进likedUsers这个数组中
                    } else {
                        newsItem.likedUsers = [req.session.username]
                        newsItem.type = newsType
                        db.insertOne('news', newsItem, (err, result) => {
                            res.send({
                                status: 3,
                                addedObj: result.ops,
                                msg: 'You are the first one to like this piece of news'
                            })
                        })
                    }
                }
            })
        }
    },
    // dislike the news the user liked before
    dislike: (req, res, db) => {
        const newsType = req.body.data.newsType
        const newsItem = req.body.data.newsItem
        if(req.session.login !== '1')
            res.send({status: -1, msg: 'You are not logged in'})
        else {
            db.findOneAndUpdate('news', {type: newsType, title: newsItem.title}, {likedUsers: req.session.username}, (err, result) => {
                if (!err) {
                    db.find('news',  {type: newsType, title: newsItem.title}, (err, result) => {
                        res.send({
                            status: 1,
                            msg: 'You unliked the news',
                            result: result[0]
                        })
                    })
                } else
                    console.log(err)
            })
        }

    }
}
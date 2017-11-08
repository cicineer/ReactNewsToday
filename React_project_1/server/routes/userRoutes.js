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
                    console.log(req.session)
                    res.send({status: 1, msg: 'Welcome ' + username})
                } else if (md5(password) !== passwordFromDb) {
                    res.send({status: -1, msg: 'password not correct'})
                }
            } else {
                res.send({status: -2, msg: 'user not exist'})
            }
        })
    },
    register: (req, res, db, md5) => {
        console.log(req.body)
        const username = req.body.formData.userName
        const password = md5(req.body.formData.password)
        db.find('user_table', {username: username}, function (err, result) {
            if (result.length !== 0) {
                console.log(username + ' has already existed')
                res.send({status: -1, msg: username + ' has already existed'})
                res.end()
                return
            }
            db.insertOne('user_table', {username: username, password: password}, function (err, result) {
                if (err) {
                    console.log(123)
                    console.log(err)
                    res.send(err)
                    return
                }
                req.session.login = '1'
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
    // like: (req, res, db) => {
    //     if (req.session.login !== '1')
    //         res.send({status: -1, msg: 'You are not logged in'})
    //     else {
    //         db.
    //     }
    // }
}
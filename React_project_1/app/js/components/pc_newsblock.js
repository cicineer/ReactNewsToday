import React from 'react'
import {Card, Icon, notification} from 'antd'
import {HashRouter, Switch, Route, Link} from 'react-router-dom'
import axios from 'axios'

export default class PCNewsBlock extends React.Component {

    constructor() {
        super()
        this.state = {
            news: [],
            stateText: 'Please wait while we are working'
        }
    }

    componentWillMount() {
        const self = this
        const newsType = this.props.newsType
        axios.get('http://127.0.0.1:3000/news/' + newsType, {
            withCredentials: true
        })
            .then(function (response) {
                if (response.data.status === -1) {
                    // react set timeout 要把它绑在this上面
                    setTimeout(function () {
                        {
                            self.setState({
                                stateText: response.data.msg
                            })
                        }
                    }.bind(self), 3000)
                } else {
                    const news = response.data
                    self.setState({
                        news: news
                    })
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    handleHeartClick(newsItem, newsType) {
        const self = this
        axios.get('http://127.0.0.1:3000', {
            withCredentials: true
        })
            .then(function (response) {
                if (response.data !== 1) {
                    // 如果当前用户没有login，那么弹出提示框提示用户登陆
                    notification.open({
                        message: 'Please login',
                        icon: <Icon type="close-circle"/>
                    })
                } else {
                    // 如果是当前新闻用户喜欢的话，点击这个Icon就取消喜欢
                    if (newsItem.isLikedByCurrentUser === true) {
                        axios.post('http://127.0.0.1:3000/user/dislikeNews',{
                            data: {
                                newsItem: newsItem,
                                newsType: newsType
                            },
                            withCredentials: true
                        }).then((response) => {
                            const news = self.state.news
                            const updatedData = response.data.result
                            for (let i = 0; i < news.length; i++) {
                                if (news[i].title === updatedData.title) {
                                    news[i] = updatedData
                                    delete news[i].isLikedByCurrentUser
                                }
                            }
                            self.setState({news: news})
                        }).catch((err) => {

                        })
                    } else {
                        // 如果当前用户没有喜欢这条新闻，那么点击表示喜欢
                        axios.post('http://127.0.0.1:3000/user/likeNews', {
                            withCredentials: true,
                            data: {
                                newsItem: newsItem,
                                newsType: newsType
                            }
                        })
                            .then(function (response) {
                                const currentNews = self.state.news
                                const changedItem = response.data.addedObj[0]
                                for (let i = 0; i < currentNews.length; i++) {
                                    if (currentNews[i].title === changedItem.title) {
                                        // set this item liked by the current user!!
                                        // important and this will make the heart goes red when
                                        // react re-rendering
                                        changedItem.isLikedByCurrentUser = true
                                        currentNews[i] = changedItem
                                        break
                                    }
                                }
                                self.setState({
                                    news: currentNews
                                })
                            })
                            .catch(function (err) {
                                console.log(err)
                            })
                    }
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    render() {
        const news = this.state.news
        const newsList = news.length ?
            news.map((newsItem, index) => {
                    return (
                        <Card.Grid class='cardGrid' key={index}>
                            <div className="custom-image">
                                <img alt="example" width="100%" height='200px' src={newsItem.urlToImage}/>
                            </div>
                            <div className="custom-card">
                                <h4>{newsItem.title}</h4>
                                <p style={{fontSize: '12px'}}>{newsItem.description}</p>
                                <p style={{fontSize: '12px', color: 'black'}}>{
                                    new Date(newsItem.publishedAt).getFullYear() + '-' +
                                    (new Date(newsItem.publishedAt).getMonth() + 1) + '-' +
                                    new Date(newsItem.publishedAt).getDate()
                                }</p>
                                <a href={newsItem.url} target='_blank'>more information</a>
                                <div>
                                    {
                                        newsItem.isLikedByCurrentUser ?
                                            <Icon type="heart" style={{cursor: 'pointer', color: 'darkRed'}}
                                                  onClick={this.handleHeartClick.bind(this, newsItem, this.props.newsType)}/>
                                            :
                                            <Icon type="heart" style={{cursor: 'pointer'}}
                                                  onClick={this.handleHeartClick.bind(this, newsItem, this.props.newsType)}/>
                                    }
                                </div>
                            </div>
                        </Card.Grid>
                    )
                }
            ) :
            <div>{this.state.stateText}</div>

        return (
            <div>
                {newsList}
            </div>
        )
    }

}
import React from 'react'
import {Card, Icon, notification} from 'antd'
import {HashRouter, Switch, Route, Link} from 'react-router-dom'
import axios from 'axios'

export default class PCNewsBlock extends React.Component {

    constructor() {
        super()
        this.state = {
            news: []
        }
    }

    componentWillMount() {
        const self = this
        const newsType = this.props.newsType
        console.log('PCNewsblock ' + newsType)
        axios.get('http://127.0.0.1:3000/news/' + newsType, {
            withCredentials: true
        })
            .then(function (response) {
                const news = response.data
                console.log(response.data)
                self.setState({
                    news: news
                })
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    handleHeartClick(title) {
        axios.get('http://127.0.0.1:3000', {
            withCredentials: true
        })
            .then(function (response) {
                if(response.data !== 1) {
                    notification.open({
                        message:'Please login',
                        icon: <Icon type="close-circle" />
                    })
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    render() {
        const news = this.state.news
        const newsList = news.length ?
            news.map((newsItem, index) => (
                    <Card.Grid style={{width: '25%', height: 500}} key={index}>
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
                                <Icon type="heart" style={{cursor: 'pointer'}}
                                      onClick={this.handleHeartClick.bind(this, newsItem.title)}/>
                            </div>
                        </div>
                    </Card.Grid>
                )
            ) :
            <div>Please wait while we are working</div>

        return (
            <div>
                {newsList}
            </div>
        )
    }

}
import React from 'react'
import {Row, Col, Tabs, Carousel} from 'antd'
import PCNewsBlock from './pc_newsblock'

const TabPane = Tabs.TabPane

export default class PCNewsContainer extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <PCNewsBlock newsType={this.props.newsType}/>
                </div>
            </div>
        )
    }
}
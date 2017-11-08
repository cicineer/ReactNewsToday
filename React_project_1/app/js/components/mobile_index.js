import React from 'react'
import MobileHeader from './mobile_header'
import MobileFooter from './mobile_footer'
import {Badge, Tabs, WhiteSpace} from 'antd-mobile'

export default class MobileIndex extends React.Component {

    constructor() {
        super()
        this.renderContent = this.renderContent.bind(this)
    }

    renderContent(tab) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '150px',
                backgroundColor: '#fff'
            }}>
                <p>Content of {tab.title}</p>
            </div>)
    }

    render() {
        const tabs = [
            {title: 'News'},
            {title: 'Techs'},
            {title: 'Sport'},
            {title: 'Society'}
        ];

        return (
            <div>
                <MobileHeader/>
                <div>
                    <Tabs tabs={tabs}>
                        {this.renderContent}
                    </Tabs>
                </div>
                <MobileFooter/>
            </div>
        )
    }
}
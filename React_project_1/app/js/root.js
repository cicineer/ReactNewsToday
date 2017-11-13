import React from 'react'
import ReactDOM from 'react-dom'
import PCIndex from './components/pc_index'
import MobileIndex from './components/mobile_index'
import MediaQuery from 'react-responsive'
import Favicon from 'react-favicon'

import 'antd/dist/antd.css'
import 'antd-mobile/dist/antd-mobile.min.css'
import '../css/pc.css'
import '../css/mobile.css'

class Root extends React.Component {
    render() {
        return (
            <div>
                <Favicon url="http://oflisback.github.io/react-favicon/public/img/react.ico" />
                <MediaQuery query='(min-device-width: 1224px'>
                    <PCIndex/>
                </MediaQuery>
                <MediaQuery query='(max-device-width: 1224px'>
                    <MobileIndex/>
                </MediaQuery>
            </div>
        )
    }
}

ReactDOM.render(
    <Root/>,
    document.getElementById('app')
)
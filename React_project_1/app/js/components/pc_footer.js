import React from 'react'
import { Col } from 'antd'

export default class PCFooter extends React.Component {

    render(){
        return (
            <footer>
                <Col span={2}>
                </Col>
                <Col span={20} className='pcFooterText'>
                    <span>&copy;&nbsp;React News 2017&nbsp;&nbsp;All rights reserved.</span>
                </Col>
                <Col span={2}>
                </Col>
            </footer>
        )
    }
}



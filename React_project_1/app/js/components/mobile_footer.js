import React from 'react'
import {Col} from 'antd'

const MobileFooter = () => {
    return (
        <footer>
            <Col span={2}>
            </Col>
            <Col span={20} className='mobileFooterText'>
                <span>&copy;&nbsp;React News 2017&nbsp;&nbsp;All rights reserved.</span>
            </Col>
            <Col span={2}>
            </Col>
        </footer>
    )
}

export default MobileFooter
import React from 'react'
import {Row, Col} from 'antd'
import {Menu, Icon, Tabs, Form, Button, Modal, notification} from 'antd'
import {Link} from 'react-router-dom'
import PCHeaderRegister from './pc_form/pc_header_register'
import PCHeaderLogin from './pc_form/pc_header_login'
import axios from 'axios'
import PCNewsContainer from "./pc_newscontainer";

axios.defaults.withCredentials = true
const FormItem = Form.Item
const TabPane = Tabs.TabPane

class PCHeader extends React.Component {

    constructor() {
        super()
        this.state = {
            current: 'natureAndSociety',
            modalVisible: false,
            action: 'login',
            hasLoggedIn: false,
            userNickName: '',
            userId: 0,
        }
        this.handleLoginModal = this.handleLoginModal.bind(this)
    }

    componentWillMount() {
        const self = this
        axios.get('http://127.0.0.1:3000', {
            withCredentials: true
        })
            .then(function (response) {
                if (response.data === 1) {
                    self.setState({
                        hasLoggedIn: true
                    })
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    handleLoginModal(isClose, status, message) {
        if(status === 1){
            this.setState({
                modalVisible: isClose,
                hasLoggedIn: true
            })
        }
        if (status === -1) {
            notification.open({
                message: message,
            })
        } else if (status === -2) {
            notification.open({
                message: message,
            })
        }
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible})
    }

    handleSignup() {
        this.setState({
            modalVisible: true
        })
    }

    handleLogoutButton() {
        const self = this
        axios.post('http://127.0.0.1:3000/logout', {
            withCredentials: true
        })
            .then(function (response) {
                console.log(response)
                if (response.data === 1) {
                    console.log(self.state.hasLoggedIn)
                    self.setState({
                        hasLoggedIn: false
                    })
                    console.log(self.state.hasLoggedIn)
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    callback(e) {
        this.setState({
            current: e
        })
    }

    render() {
        const userShow = this.state.hasLoggedIn ?
            <div>
                <Button type='dashed' htmlType='button'>User Profile</Button>
                &nbsp;&nbsp;
                <Button type='ghost' htmlType='button' onClick={this.handleLogoutButton.bind(this)}>Logout</Button>
            </div> :
            <div className='header-margin'>
                <Button onClick={this.handleSignup.bind(this)} type='primary'>Sign Up/Login</Button>
            </div>
        return (
            <div>
                <header className='header-margin'>
                    <Row>
                        <Col span={2}></Col>
                        <Col span={4}>
                            <a href='/'>
                                <span>NewsToday</span>
                            </a>

                            {userShow}
                        </Col>
                        <Col span={16}>
                        </Col>
                        <Col span={2}></Col>
                        <Modal
                            title="User center"
                            visible={this.state.modalVisible}
                            onOk={() => this.setModalVisible(false)}
                            onCancel={() => this.setModalVisible(false)}
                            footer={null}
                        >
                            <Tabs defaultActiveKey="1" style={{'paddingBottom': '10px'}}>
                                <TabPane tab="Sign in" key="1">
                                    <PCHeaderLogin handleLoginModal={this.handleLoginModal}/>
                                </TabPane>
                                <TabPane tab="Sign up" key="2">
                                    <PCHeaderRegister/>
                                </TabPane>
                            </Tabs>
                        </Modal>
                    </Row>
                </header>
                <Row>
                    <Col span={20} offset={2}>
                        <Tabs defaultActiveKey="natureAndSociety" onChange={this.callback.bind(this)}>
                            <TabPane tab="Society" key="natureAndSociety">
                                <PCNewsContainer newsType={this.state.current}/>
                            </TabPane>
                            <TabPane tab="Technology" key="technology">
                                <PCNewsContainer newsType={this.state.current}/>
                            </TabPane>
                            <TabPane tab="Sport" key="sport">
                                <PCNewsContainer newsType={this.state.current}/>
                            </TabPane>
                            <TabPane tab="Entertainment" key="entertainment">
                                <PCNewsContainer newsType={this.state.current}/>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>

            </div>
        )
    }
}

export default PCHeader
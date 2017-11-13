import React from 'react'
import {Row, Col} from 'antd'
import {Menu, Icon, Tabs, Form, Button, Modal, notification} from 'antd'
import {Link} from 'react-router-dom'
import PCHeaderRegister from './pc_form/pc_header_register'
import PCHeaderLogin from './pc_form/pc_header_login'
import axios from 'axios'
import PCNewsBlock from "./pc_newsblock";

axios.defaults.withCredentials = true
const TabPane = Tabs.TabPane

class PCHeader extends React.Component {

    constructor() {
        super()
        this.state = {
            // the current tab of the news
            current: 'natureAndSociety',
            modalVisible: false,
            // the news is got after the user has logged in
            // otherwise the news will be empty
            newsFromDbAfterLogin: [],
            hasLoggedIn: false,
            currentUsername: '',
            userId: 0,
            news: []
        }
        this.handleLoginModal = this.handleLoginModal.bind(this)
        this.handleRefresh = this.handleRefresh.bind(this)
    }

    componentWillMount() {
        const self = this
        axios.get('http://127.0.0.1:3000', {
            withCredentials: true
        })
            .then(function (response) {
                if (response.data.isLogin === '1') {
                    self.setState({
                        currentUsername: response.data.username,
                        hasLoggedIn: true
                    })
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    handleLoginModal(isClose, status, message, newsFromDb, username) {
        if (status === 1) {
            this.setState({
                modalVisible: isClose,
                hasLoggedIn: true,
                newsFromDbAfterLogin: newsFromDb,
                currentUsername: username
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
                if (response.data === 1) {
                    self.setState({
                        hasLoggedIn: false,
                        // because you're logged out, so clear the news got after login
                        newsFromDbAfterLogin: []
                    })
                    self.refs.PcNewsBlock.handleLogoutAction()
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    handleRefresh() {
        this.refs.PcNewsBlock.getRefreshedNews(this.state.current)
    }

    callback(e) {
        this.setState({
            current: e
        })
    }

    render() {
        const userShow = this.state.hasLoggedIn ?
            <div>
                <span style={{'marginRight': '5px', 'color': '#2db7f5'}}>{this.state.currentUsername}</span>
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
                        <Col span={4} offset={2}>
                            <h1>NewsToday</h1>
                        </Col>
                        <Col offset={12} span={5}>
                            <div style={{'marginTop': '35px'}}>{userShow}</div>
                        </Col>
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
                            <TabPane tab={<span>Society  <Icon type="reload" onClick={this.handleRefresh}
                                                               style={{color: '#2db7f5', fontSize: '15px'}}/></span>} key="natureAndSociety">
                                <PCNewsBlock newsType={this.state.current}
                                             newsFromDbAfterLogin={this.state.newsFromDbAfterLogin}
                                             handleLogout={this.handleLogoutButton}
                                             ref='PcNewsBlock'/>
                            </TabPane>

                            <TabPane tab={<span>Technology  <Icon type="reload" onClick={this.handleRefresh}
                                                                  style={{color: '#2db7f5', fontSize: '15px'}}/></span>} key="technology">
                                <PCNewsBlock newsType={this.state.current}
                                             newsFromDbAfterLogin={this.state.newsFromDbAfterLogin}
                                             handleLogout={this.handleLogoutButton}
                                             ref='PcNewsBlock'/>
                            </TabPane>

                            <TabPane tab={<span>Sport  <Icon type="reload" onClick={this.handleRefresh}
                                                             style={{color: '#2db7f5', fontSize: '15px'}}/></span>} key="sport">
                                <PCNewsBlock newsType={this.state.current}
                                             newsFromDbAfterLogin={this.state.newsFromDbAfterLogin}
                                             handleLogout={this.handleLogoutButton}
                                             ref='PcNewsBlock'/>
                            </TabPane>

                            <TabPane tab={<span>Entertainment  <Icon type="reload" onClick={this.handleRefresh}
                                                                     style={{
                                                                         color: '#2db7f5',
                                                                         fontSize: '15px'
                                                                     }}/></span>} key="entertainment">
                                <PCNewsBlock newsType={this.state.current}
                                             newsFromDbAfterLogin={this.state.newsFromDbAfterLogin}
                                             handleLogout={this.handleLogoutButton}
                                             ref='PcNewsBlock'/>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>

            </div>
        )
    }
}

export default PCHeader
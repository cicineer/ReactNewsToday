import React from 'react'
// import {Icon, Button, Modal, WhiteSpace, Badge, WingBlank, List, Toast} from 'antd-mobile'
import {Modal, WhiteSpace, Button, WingBlank, Toast, List, InputItem, Icon} from 'antd-mobile'
import axios from 'axios'
import {createForm} from 'rc-form';

const prompt = Modal.prompt;

class MobileHeader extends React.Component {

    constructor() {
        super()
        this.state = {
            isLogin: false,
            modal: false,
        }
        this.cancelModal = this.cancelModal.bind(this)
    }

    componentWillMount() {
        const self = this
        axios.get('http://127.0.0.1:3000', {
            withCredentials: true
        })
            .then(function (response) {
                console.log(response)
                if (response.data === 1) {
                    self.setState({
                        isLogin: true
                    })
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    showModal(value) {
        this.setState({
            isVisible: value
        })
    }

    cancelModal(){
        this.setState({
            modal: false
        })
        // force reload because the data can't be filled in
        // when set modal false
        window.location.reload(false)
    }

    onClose(value) {
        this.setState({
            isVisible: value
        })
    }

    handleSignup(e) {
        e.preventDefault()
        this.setState({
            isVisible: true
        })
    }

    handleLogin(self, userName, password) {
        axios.post('http://127.0.0.1:3000/login', {
            formData: {userName: userName, password: password},
            withCredentials: true
        })
            .then(function (response) {
                console.log(response)
                if (response.data.status === 1) {
                    self.setState({
                        isLogin: true
                    })
                    Toast.success(response.data.msg, 1)
                } else if (response.data.status === -1) {
                    Toast.fail(response.data.msg, 1)
                } else {
                    Toast.fail(response.data.msg, 1)
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    handleRegister() {
        const self = this
        const toast = Toast
        this.props.form.validateFields((err, values) => {
            if (values.userName === '' || values.userName === null || values.userName === undefined) {
                Toast.fail('user name empty', 1)
            } else if (values.password === '' || values.password === null || values.password === undefined) {
                Toast.fail('password empty', 1)
            } else if (values.repeat === '' || values.repeat === null || values.repeat === undefined) {
                Toast.fail('repeat password empty', 1)
            } else if (values.password !== values.repeat) {
                Toast.fail('password not match', 1)
            } else {
                axios.post('http://127.0.0.1:3000/register', {
                    formData: values,
                    withCredentials: true
                })
                    .then(function (response) {
                        console.log(response)
                        if (response.data.status === -1) {
                            Toast.fail(response.data.msg)
                        } else {
                            Toast.success(response.data.msg)
                            self.setState({
                                modal: false
                            })
                            self.setState({
                                isLogin: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        })
    }

    render() {
        const {getFieldProps} = this.props.form
        const self = this
        const userShow = this.state.isLogin ?
            // logout logic
            <span style={{'float': 'right', 'marginRight': '10px', 'fontSize': '12px'}} onClick={() => {
                axios.post('http://127.0.0.1:3000/logout', {
                    withCredentials: true
                })
                    .then(function (response) {
                        console.log(response)
                        if (response.data === 1) {
                            self.setState({
                                isLogin: false
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }}>Logout</span> :

            <div className='header-login'>
                {/*login logic use mobile modal prompt*/}
                <span onClick={() => prompt(
                    'User Login',
                    'Please input login information',
                    [
                        {text: 'Cancel'},
                        // onpress的这两个顺序不能反
                        {
                            text: 'Submit', onPress: (userName, password) => {
                            // console.log(` Username: ${userName},Password:${password}`)
                            this.handleLogin(self, userName, password)
                        }
                        },
                    ],
                    'login-password',
                    null,
                    ['Please input name', 'Please input password'],
                )}>Login</span>

                {/*logout logic use mobile popup modal combined with InputItem*/}
                <span onClick={() => {
                    this.setState({
                        modal: true
                    })
                }
                }>Register</span>

                <WingBlank>
                    <WhiteSpace/>
                    <Modal
                        popup
                        visible={this.state.modal}
                        animationType="slide-up"
                    >
                        <List renderHeader={() => <h3>Register</h3>} className="popup-list">
                            <InputItem
                                {...getFieldProps('userName')}
                                clear
                            >Username</InputItem>
                            <InputItem
                                type='password'
                                {...getFieldProps('password')}
                                clear
                            >Password</InputItem>
                            <InputItem
                                type='password'
                                {...getFieldProps('repeat')}
                                clear
                            >Repeat</InputItem>
                            <List.Item>
                                <Button size='small' type="primary"
                                        onClick={this.handleRegister.bind(this)}>Register</Button>
                            </List.Item>
                            <List.Item>
                                <Button size='small' type="primary" onClick={this.cancelModal}>Cancel</Button>
                            </List.Item>
                        </List>
                    </Modal>
                </WingBlank>
            </div>
        return (
            <div id='mobile'>
                <header>
                    <img src='./images/logo.png' alt='logo'></img>
                    <span>ReactNews</span>
                    {userShow}
                </header>
            </div>
        )
    }
}

export default MobileHeader = createForm()(MobileHeader)

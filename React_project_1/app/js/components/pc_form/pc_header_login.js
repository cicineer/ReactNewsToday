const React = require('react')
import {Form, Button, Input, Icon} from 'antd'
// import rp from 'request-promise'
import axios from 'axios'

axios.defaults.withCredentials = true
const FormItem = Form.Item


class PCHeaderLogin extends React.Component {

    handleLogin(e) {
        e.preventDefault()
        var self = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                axios.post('http://127.0.0.1:3000/login', {
                    formData: values,
                    withCredentials: true
                })
                    .then(function (response) {
                        if (response.data.status === 1) {
                            self.props.handleLoginModal(false, response.data.status, response.data.msg)
                        } else {
                            self.props.handleLoginModal(true, response.data.status, response.data.msg)
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <Form onSubmit={this.handleLogin.bind(this)} class='loginForm'>

                <FormItem label='Account'>

                    {getFieldDecorator('userName', {
                        rules: [{required: true, message: 'Your user name please'}]
                    })(
                        <Input prefix={<Icon type='user'/>} placeholder='Username'/>
                    )}

                </FormItem>

                <FormItem label='Password'>

                    {getFieldDecorator('password', {
                        rules: [{required: true, message: 'Your password please'}]
                    })(
                        <Input prefix={<Icon type='lock'/>} placeholder='Password'
                               type='password'/>
                    )}

                </FormItem>
                <Button type='primary' htmlType='submit' className='login-form-button'>Sign
                    In</Button>
            </Form>

        )
    }

}

export default PCHeaderLogin = Form.create({})(PCHeaderLogin);
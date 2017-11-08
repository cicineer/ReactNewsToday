const React = require('react')
import {Form, Button, Input, Icon} from 'antd'
import axios from 'axios'

const FormItem = Form.Item


class PCHeaderRegister extends React.Component {

    handleRegister(e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios.post('http://127.0.0.1:3000/register', {
                    formData: values,
                    withCredentials: true
                })
                    .then(function (response) {
                        console.log(response)
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
            <Form onSubmit={this.handleRegister.bind(this)} class='loginForm'>

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

                <FormItem label='Repeat password'>
                    {getFieldDecorator('repeatPassword', {
                        rules: [{required: true, message: 'Repeat your password'}]
                    })(
                        <Input prefix={<Icon type='lock'/>} placeholder='repeat password'
                               type='password'
                        />
                    )}
                </FormItem>
                <Button type='primary' htmlType='submit' className='login-form-button'>Sign
                    Up</Button>
            </Form>
        )
    }

}


export default PCHeaderRegister = Form.create({})(PCHeaderRegister);
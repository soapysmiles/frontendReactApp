import React from 'react';

import  { Redirect } from 'react-router-dom'

import {
  Form,
  Input,
  Alert,
  Button
} from 'antd';

var config = require('../config.js')

/**
 * @name loginForm Post login details
 * @type {class}
 * @author A.M
 */
class loginForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        confirmDirty: false,
        loginSuccessful: false, 
        showSuccess: false, 
        showError: false,
        errorCode: 400, 
        responseStatus: "nothing", 
        errorMessage: ""   //the error message to display to the user after server rejects action
    };
  }
  

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //use fetch API to post the user data
        fetch(`${config.config.server_loc}/login`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        }).then(res => {
            console.log(res)
          if(res.ok)
            this.setState({loginSuccessful:true})
          else
            this.setState({
                loginSuccessful:false,
                errorCode: res.status
            });

            return res.json()
        }).then(data => this.checkResponse(data))
      }
    });
  };

  checkResponse = (data) => {

    if(this.state.loginSuccessful){
      if(data.user.deleted == 0){//If user account is deleted
        this.props.form.resetFields();
        localStorage.setItem(`jwt`, data.token);//Get & store jwt token
        localStorage.setItem(`uid`, data.user.ID);//Get & store uid
        localStorage.setItem(`tfaActivate`, (data.tfa == 1) ? true : false )//Set local storage tfa active
        this.props.activateTfa(localStorage.getItem('tfaActivate'))//Make app aware tfa is active or not
        
        this.setState({
            showSuccess:true,
            showError : false
          });
      }else{
        localStorage.setItem(`tfaActivate`, false )
        this.setState({
            showSuccess:false,
            showError : true,
            errorMessage: 'User account is deleted - contact an admin to restore',
            responseStatus: 'error'
          });
      }
      
      
    }
    else{
      //handle errors
      this.setState({
        errorMessage: data.message,
        showSuccess:false,
        showError : true, 
        responseStatus: "error"
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    //this code will handle form responsivness on small devices
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 8,
          offset: 8,
        },
      },
    };
    
    if(this.state.showSuccess || localStorage.getItem('jwt')){//User has successfully logged in
      return(
        <Redirect to="/tfa"></Redirect>
      )
    }
    return (
      
      <Form {...formItemLayout} onSubmit={this.handleSubmit} >
        <Form.Item label="username" hasFeedback validateStatus={this.state.responseStatus}>
          {getFieldDecorator('username', {
            rules: [
              {
                type: 'string',
                message: 'The input is not valid username!',
              },
              {
                required: true,
                message: 'Please input your username',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Password" hasFeedback validateStatus={this.state.responseStatus}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                min: 6,
                message: 'password should be at least 6 characters long!',
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
        {this.state.showSuccess ? <Alert message="Login successful" type="success" /> :null}
        {this.state.showError ? <Alert message={this.state.errorMessage} type="error" /> :null}
      </Form>
    );
  }
}

const Signup = Form.create({ name: 'login' })(loginForm);

export default Signup;
import React from 'react';

import {
  Form,
  Input,
  Alert,
  Button
} from 'antd';
import  { Redirect } from 'react-router-dom'
var config = require('../config.js')

class loginForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        confirmDirty: false,
        activeSuccess: false, 
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
          values.userID = localStorage.getItem('uid')
          console.log(values)
        //use fetch API to post the user data
        fetch(`${config.config.server_loc}/tfalogin`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `bearer ${localStorage.getItem('jwt')}`,
            'userID': localStorage.getItem('uid'),
          },
          
          body: JSON.stringify(values)
        }).then(res => {
            console.log(res)
          if(res.ok)
            this.setState({activeSuccess:true})
          else
            this.setState({
                activeSuccess:false,
                errorCode: res.status
            });

            return res.json()
        }).then(data => this.checkResponse(data))
      }
    });
  };

  checkResponse = (data) => {

    if(this.state.activeSuccess){
        localStorage.setItem(`secret`, data.secret);
        
        this.props.login();
        
        this.setState({
            showSuccess:true,
            showError : false,
        });
    }
    else{
      //handle errors
      this.props.login(false);//TODO remove this
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
    
    if(!(localStorage.getItem('tfaActivate') == 'true') || this.state.showSuccess){
        this.props.login()
        
        return(
            <Redirect to="/information"></Redirect>
        )
    }else{
        return (
        
            <Form {...formItemLayout} onSubmit={this.handleSubmit} >
              
              <Form.Item label="token" hasFeedback validateStatus={this.state.responseStatus}>
                {getFieldDecorator('token', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your password!',
                      
                    },
                    {
                      
                      min: 6,
                      
                      message: 'Token is 6 digits',
                    },
                  ],
                })(<Input.Password />)}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
              {this.state.showSuccess ? <Alert message="Login successful" type="success" /> :null}
              {this.state.showError ? <Alert message={this.state.errorMessage} type="error" /> :null}
            </Form>
          );
    }
    
    
  }
}

const Signup = Form.create({ name: 'login' })(loginForm);

export default Signup;
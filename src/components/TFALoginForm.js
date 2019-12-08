import React from 'react';

import {
  Form,
  Input,
  Alert,
  Button,
  Typography
} from 'antd';
import  { Redirect } from 'react-router-dom'
const { Title } = Typography;

var config = require('../config.js')

/**
 * @name TFAloginForm Handles logging in with two factor authentication
 * @type {class}
 * @author A.M
 */
class TFAloginForm extends React.Component {
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
            'Authorization' : `bearer ${localStorage.getItem('jwt')}`,//Add authorisation to header
            'userID': localStorage.getItem('uid'),//Add userID to the header
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
        localStorage.setItem(`secret`, data.secret);//Set the tfa secret
        
        this.props.login();
        
        this.setState({
            showSuccess:true,
            showError : false,
        });
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
        xs: { span: 16 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
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
              <Title level={2} style={{margin: '0 auto', textAlign: 'center'}}>Enter your Two Factor Authentication Token</Title>
              <br/>
              <Form.Item label="token" hasFeedback validateStatus={this.state.responseStatus}>
                {getFieldDecorator('token', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your token!',
                      
                    },
                    {
                      
                      min: 6,
                      max: 6,
                      message: 'Token is 6 digits',
                    },
                  ],
                })(<Input type="number" />)}
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

const Signup = Form.create({ name: 'login' })(TFAloginForm);

export default Signup;
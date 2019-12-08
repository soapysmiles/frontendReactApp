import { Avatar, Alert, Typography, Row, Col, Form,
    Input,
    Button } from 'antd';
import React from 'react';
const { Title } = Typography;

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
        errorMessage: "",
        secret: "",
        qrcode: "",
    };
  }
  

  handleSubmit = e => {
    e.preventDefault();
    
    fetch(`${config.config.server_loc}/tfa/deactivate`, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `bearer ${localStorage.getItem('jwt')}`,
        'secret': localStorage.getItem('secret')
        },
        body: JSON.stringify({userID: parseInt(localStorage.getItem('uid'))})
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
    
  };

  checkResponse = (data) => {

    if(this.state.activeSuccess){
        this.props.activateTfa(false);
        localStorage.removeItem('secret');
        this.setState({
            showSuccess:true,
            showError : false,
            secret: data.secret,
            qrcode: data.qrcode,
        });
    }
    else{
      //handle errors

      this.props.activateTfa(true);
      this.setState({
        errorMessage: data.message,
        showSuccess:false,
        showError : true, 
        responseStatus: "error"
      });
    }
  }

  render() {
    
    
    return (
        <div>
        <Form onSubmit={this.handleSubmit} >
            
            <Form.Item >
            {this.state.showSuccess ? null : <Button type="primary" htmlType="submit" > DEACTIVATE Two Factor Authentication </Button>}
            </Form.Item>
            {this.state.showSuccess ? <Alert message="Deactivation successful" type="success" /> :null}
            {this.state.showError ? <Alert message={this.state.errorMessage} type="error" /> :null}
        </Form>
        </div>
    );
    }
    
}

const activate = Form.create({ name: 'activate' })(loginForm);

export default activate;
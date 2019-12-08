import { Avatar, Alert, Typography, Row, Col, Form,
    Input,
    Button } from 'antd';
import React from 'react';
import  { Redirect } from 'react-router-dom'
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
        tfaActivate: props.tfaActivate,
    };
  }
  

  handleSubmit = e => {
    e.preventDefault();
    
    fetch(`${config.config.server_loc}/tfa/activate`, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `bearer ${localStorage.getItem('jwt')}`,
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
        this.props.activateTfa(true);
        localStorage.setItem(`secret`, data.secret);
        this.setState({
            showSuccess:true,
            showError : false,
            secret: data.secret,
            qrcode: data.qrcode,
        });
    }
    else{
      //handle errors

      this.props.activateTfa(false);
      this.setState({
        errorMessage: data.message,
        showSuccess:false,
        showError : true, 
        responseStatus: "error"
      });
    }
  }

  render() {
    
    if(this.state.tfaActivate){
        
        return(
            <Redirect to="/"></Redirect>
        )
    }

    if(this.state.secret.length === 0){
        return (
            <div>
            <Form onSubmit={this.handleSubmit} >
                
                <Form.Item >
                <Button type="primary" htmlType="submit" >
                    ACTIVATE Two Factor Authentication
                </Button>
                </Form.Item>
                {this.state.showSuccess ? <Alert message="Login successful" type="success" /> :null}
                {this.state.showError ? <Alert message={this.state.errorMessage} type="error" /> :null}
            </Form>
            </div>
        );
    }else{
        return(
            <div style={{margin: '0 auto'}}>
                <Alert message="Two Factor Authentication is enabled - now use a TFA app to save this secret" type="success" />
                <Row>            
                    <Col md={{span: 12, offset: 6}}>
                        <div style={{margin: '0 auto', width: '300px'}}>
                            <Avatar shape="square" size={300} src={(this.state.qrcode) ? `${this.state.qrcode}` : ""}/>
                        </div>
                    </Col>

                </Row>
                
                <Row>
                    <Col md={{span: 12, offset: 6}}>
                        <div style={{margin: '0 auto', textAlign: 'center'}}>
                            <span>Secret:<Title level={2}>{this.state.secret}</Title></span>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
    
  }
}

const activate = Form.create({ name: 'activate' })(loginForm);

export default activate;
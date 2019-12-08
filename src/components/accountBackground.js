import { Avatar, Alert, Typography, Row, Col } from 'antd';
import React from 'react';
const { Title } = Typography;

var config = require('../config.js')

class AccountBackground extends React.Component{
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            _isMounted: false,
            fetchSuccessful: false,
            user: {},
            errorCode: '',
            showActive: false,
        };
    }

    componentDidMount(){
        this._isMounted = true
            fetch(`${config.config.server_loc}/user/${localStorage.getItem('uid')}`,{
                method: 'GET',
                headers: {
                    'Accept' : 'application/json',
                    'Authorization' : `bearer ${localStorage.getItem('jwt')}`,
                }
            }).then(res => {
                if(this._isMounted){
                    console.log(res)
                    if(res.ok)
                        this.setState({fetchSuccessful : true})
                    else
                        this.setState({
                            fetchSuccessful: false,
                            errorCode: res.status,
                        })
                    return res.json()
                }
                return {}
                
            }).then(res => {

                if(this.state.fetchSuccessful){
                    this.props.stopSkeleton()
                    
                    res.birthDate =  res.birthDate.slice(0,10);
                    res.dateRegistered =  res.dateRegistered.slice(0,10);

                    (res.active == 0) ? this.setState({showActive: true}) : this.setState({showActive: false})

                    this.setState({user: res})
                    
                }else{
                }
            })
    }   
    

    componentWillUnmount(){
        this._isMounted = false
    }

    render(){
        console.log(this.state)
        return(
            <div style={{margin: '0 auto'}}>
            <Row type="flex" align="middle">
                
                <Col md={{span: 12, offset: 6}}>
                    <div style={{margin: '0 auto', width: '106px'}}>
                        <Avatar shape="square" size={106} src={(this.state.user) ? `${config.config.server_base_loc}/${this.state.user.profileImageURL}` : ""}/>
                    </div>
                </Col>
                
            </Row>
            <Row>
                <Col md={{span: 12, offset: 6}}>
                    <div style={{margin: '0 auto', textAlign: 'center'}}>
                        <span>Username:<Title level={2}>{this.state.user.username}</Title></span>
                        <span>Country:<Title level={2}>{this.state.user.countryAbbrev}</Title></span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={{span: 12, offset: 6}}>
                    <div style={{margin: '0 auto', textAlign: 'center'}}>
                        <span>Email:<Title level={4}>{this.state.user.email}</Title></span>
            
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md={{span: 12, offset: 6}}>
                    <div style={{margin: '0 auto', textAlign: 'center'}}>
                        <span>About:<Title level={4}>{this.state.user.about}</Title></span>
            
                    </div>
                </Col>
            </Row>
            
            <Row> 
                <Col md={{span: 12, offset: 6}}>
                    <div style={{margin: '0 auto', textAlign: 'center'}}>
                        <span>First name:<Title level={4}>{this.state.user.firstName}</Title></span>
            
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={{span: 12, offset: 6}}>
                    <div style={{margin: '0 auto', textAlign: 'center'}}>
                        <span>Last name:<Title level={4}>{this.state.user.lastName}</Title></span>
            
                    </div>
                </Col>
                
            </Row>
            <Row>
                <Col md={{span: 12, offset: 6}}>
                    <div style={{margin: '0 auto', textAlign: 'center'}}>
                        <span>Date of birth:<Title level={4}>{this.state.user.birthDate}</Title></span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={{span: 12, offset: 6}}>
                    <div style={{margin: '0 auto', textAlign: 'center'}}>
                        <span>Date of registration:<Title level={4}>{this.state.user.dateRegistered}</Title></span>
                    </div>
                </Col>
            </Row>
            {this.state.showActive ? <Alert message="This account is not active" type="error" /> :null}
            </div>
        )
    }
}

export default AccountBackground
import React from 'react';
import {BrowserRouter,Route, Switch} from 'react-router-dom'
import logo from './logo.svg';
import { Card, Menu, Icon, Layout} from 'antd';
import './App.css';

import LoginForm from './components/loginForm';
import PrivateRoute from './components/auth';
import NaviBar from './components/navigation';
import AccountView from './components/accountView';
import TfaActivate from './components/TfaActivate';
import TfaDeactivate from './components/TfaDeactivate';
import TFALoginForm from './components/TFALoginForm';

const { Header, Footer, Sider, Content } = Layout;



class App extends React.Component{
  constructor(props){
    super(props)
    let access = false;

    /* Checks if user is already logged in */
    if(localStorage.getItem('jwt') ? true : false){
      if((localStorage.getItem('tfaActivate') == 'true')){
        if(localStorage.getItem('secret')  ? true : false){
          access = true;
        }
      }else{
        access = true
      }
    }
    this.state = {
      loggedIn:access,//Sets logged in
      tfaActivate: ((localStorage.getItem('tfaActivate') == 'true')),//Checks if TFA is activated for user
    }

    //Bind to app
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
    this.activateTfa = this.activateTfa.bind(this)
  }

  /**
   * @name logout
   * Resets localStorage and sets loggedIn state to false
   */
  logout(){
    localStorage.clear()
    this.setState({loggedIn: false})
  }

  /**
   * @name login
   * Sets loggedIn state to true
   */
  login(){
    this.setState({loggedIn:true})
  }


  /**
   * @name activateTfa
   * Sets localStorage and state 'tfaActivate' to bool value of 'active'
   * @param {String, Bool} active If it's string, will convert to bool ('true' || 'false')
   */
  activateTfa(active){
    (typeof(active) === 'string') ? (active = ((active == 'true') ? true : false)) : active = active;
    this.setState({tfaActivate: active})
    localStorage.setItem('tfaActivate', active)
  }



  render() {return(
    
    <BrowserRouter>
    <Layout>
      
      <NaviBar loggedIn={this.state.loggedIn} logout={this.logout} tfaActive={this.state.tfaActivate}></NaviBar>
     
      <Layout style={{ marginLeft: 250 }}>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff' }}>
            <Switch>
              <PrivateRoute exact path="/" ></PrivateRoute>
              <Route exact path="/login" ><LoginForm activateTfa={this.activateTfa}></LoginForm></Route>
              <Route exact path="/tfa"><TFALoginForm login={this.login} tfaActivate={this.state.tfaActivate}></TFALoginForm></Route>
              <Route exact path="/logout" ></Route>
              <PrivateRoute exact path="/information">
                <AccountView>
                </AccountView>
              </PrivateRoute>
              <PrivateRoute exact path="/tfaActivate">
                <TfaActivate activateTfa={this.activateTfa} tfaActivate={this.state.tfaActivate}>
                </TfaActivate>
              </PrivateRoute>
              <PrivateRoute exact path="/tfaDeactivate">
                <TfaDeactivate activateTfa={this.activateTfa} tfaActivate={this.state.tfaActivate}>
                </TfaDeactivate>
              </PrivateRoute>
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Login System Designed by Aaron.M & Hannia.T</Footer>
      </Layout>
    </Layout>  
    </BrowserRouter>
  );}
}


export default App;

import React from 'react';
import {BrowserRouter,Route, Switch} from 'react-router-dom'
import logo from './logo.svg';
import { Card, Menu, Icon, Layout} from 'antd';
import './App.css';

import LoginForm from './components/loginForm';
import PrivateRoute from './components/auth'
import NaviBar from './components/navigation'
import renderEmpty from 'antd/lib/config-provider/renderEmpty';

const { Header, Footer, Sider, Content } = Layout;



class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loggedIn:((sessionStorage.getItem('jwt')) == true),
    }
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
  }

  logout(){
    sessionStorage.clear()
    this.setState({loggedIn: false})
  }

  login(){
    this.setState({loggedIn:true})
  }

  render() {return(
    
    <BrowserRouter>
    <Layout>
      
      <NaviBar  loggedIn={this.state.loggedIn} logout={this.logout}></NaviBar>
     
      <Layout style={{ marginLeft: 250 }}>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff' }}>
            <Switch>
              <PrivateRoute exact path="/" ></PrivateRoute>
              <Route exact path="/login"><LoginForm login={this.login}></LoginForm></Route>
              <PrivateRoute exact path="/logout"></PrivateRoute>
              <PrivateRoute exact path="/information"></PrivateRoute>
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

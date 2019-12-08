import React from 'react';
import { Menu, Icon, Layout } from 'antd';
import { Link } from 'react-router-dom'
const { Sider} = Layout;
const { SubMenu } = Menu;

/**
 * @name NaviBar Generates and handles navigation through SPA
 * @type {class}
 * @author A.M
 */
class NaviBar extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      theme: 'dark',
      current: '1'
    };
  }
  
  
  changeTheme = value => {
    this.setState({
      theme: value ? 'dark' : 'light',
    });
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <div className="naviBarOuter">
        <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}>
          <Menu
            theme={this.state.theme}
            onClick={this.handleClick}
            style={{ width: 256 }}
            defaultOpenKeys={['Account']}
            selectedKeys={[this.state.current]}
            mode="inline"
          >
            <Menu.Item key="home">
              <Link to="/">
                <span>
                  <Icon type="home" />
                  <span>Home</span>
                </span>
              </Link>
            </Menu.Item>
            {this.account()}
            
            
          </Menu>
        </Sider>
      </div>
    );
  }

  account(){
    return (
      <SubMenu
            key="Account"
            title={
              <span>
                <Icon type="user" />
                <span>Account</span>
              </span>
            }
          >
        {(this.props.loggedIn) ? <Menu.Item key="information" ><Link to="/information" >Account Information</Link></Menu.Item> : null}
        {(this.props.loggedIn && this.props.tfaActive) ? <Menu.Item key="disableTFA" ><Link to="/tfaDeactivate">Disable TFA</Link></Menu.Item> : null}
        {(this.props.loggedIn && !this.props.tfaActive) ? <Menu.Item key="enableTFA" ><Link to="/tfaActivate">Enable TFA</Link></Menu.Item> : null}
       
        {(this.props.loggedIn) ? null : <Menu.Item key="login"><Link to="/login" >Login</Link></Menu.Item>}
        {(this.props.loggedIn) ? null : <Menu.Item key="register"><Link to="/register">Register</Link></Menu.Item>}
        {(this.props.loggedIn || this.props.tfaActive) ? <Menu.Item key="logout" onClick={() => {this.props.logout()}}><Link to="/logout" >Logout</Link></Menu.Item> : null}
      </SubMenu>
      
      
    )
  }
}



export default NaviBar
import React from 'react';
import { Menu, Icon, Button, Layout } from 'antd';
import { Link } from 'react-router-dom'
const { Header, Footer, Sider, Content} = Layout;
const { SubMenu } = Menu;

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
    console.log(this.props.loggedIn)
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
        {(this.props.loggedIn) ? <Menu.Item key="logout" onClick={() => {this.props.logout()}}><Link to="/logout" >Logout</Link></Menu.Item> : null}
        {(this.props.loggedIn) ? null : <Menu.Item key="login"><Link to="/login" >Login</Link></Menu.Item>}
        {(this.props.loggedIn) ? null : <Menu.Item key="register"><Link to="/register">Register</Link></Menu.Item>}
      </SubMenu>
      
      
    )
  }
}



export default NaviBar
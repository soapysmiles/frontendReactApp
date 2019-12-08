import { Skeleton, Avatar, Alert } from 'antd';
import React from 'react';

import AccountBackground from './accountBackground'

var config = require('../config.js')


/**
 * @name AccountView
 * @type {class}
 * @author A.M
 */
class AccountView extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            fetchSuccessful: false,
            loading: false,
            loaded: false,
            errorCode: '',
            showError: false,
        };
        this.stopSkeleton = this.stopSkeleton.bind(this)
    }

    componentWillMount(){
        this.showSkeleton();//Show the loading skeleton
    }
    
    /**
     * @name showSkeleton
     * @author A.M
     */
    showSkeleton = () => {//Shows for 3 seconds
        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({ loading: false });
        }, 3000);
    };

    /**
     * @name stopSkeleton
     * @author A.M
     */
    stopSkeleton = () => {//Stop skeleton early
        this.setState({ loading: false});
    }

    render() {
        
        return(
        <div className="account">
            <Skeleton paragraph={{ rows: 4 }} active loading={this.state.loading}>
                <AccountBackground stopSkeleton={this.stopSkeleton}></AccountBackground>
            </Skeleton>
            {this.state.showError ? <Alert message={this.state.errorMessage} type="error" /> :null}
        </div>
        
        )
    }
}

export default AccountView;
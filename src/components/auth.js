import React from 'react';
import {Route, Redirect } from 'react-router-dom'
// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
/**
 * @name PrivateRoute Checks if user is authenticated, redirects to login if not
 * @type {function}
 * @author A.M
 */
function PrivateRoute({ children, ...rest }) {
    
  let access = false;
  if(localStorage.getItem('jwt') ? true : false){//One Factor Authentication
    if((localStorage.getItem('tfaActivate') == 'true')){//Two Factor Authentication
      if(localStorage.getItem('secret')  ? true : false){//TFA authenticated
        access = true;
      }
    }else{//Two factor authentication not set
      access = true
    }
    
  }
  return (
    
    <Route
      {...rest}//Ensures copy of previous route
      render={({ location }) =>
        (access) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
    
    

    
  }

  export default PrivateRoute

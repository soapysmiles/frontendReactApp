import React from 'react';
import {Route, Redirect } from 'react-router-dom'
// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    
  let access = false;
  if(localStorage.getItem('jwt') ? true : false){
    if((localStorage.getItem('tfaActivate') == 'true')){
      if(localStorage.getItem('secret')  ? true : false){
        access = true;
      }
    }else{
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

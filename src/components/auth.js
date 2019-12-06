import React from 'react';
import {Route, Redirect } from 'react-router-dom'
// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}//Ensures copy of previous route
        render={({ location }) =>
          sessionStorage.getItem('jwt') ? (
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

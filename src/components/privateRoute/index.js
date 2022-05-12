import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import token from '../tokenFuncs';

const PrivateRoute = (props) => {
	if(token.getTokenDecoded() && token.isExpired()){
		token.removeToken();
		
		return  <Redirect to="/login" />
	}
	const isLogged = !!localStorage.getItem('app-token');

	return isLogged ? <Route {...props} /> : <Redirect to="/login" />
}

export default PrivateRoute;
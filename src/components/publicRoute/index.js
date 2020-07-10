import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = (props) => {
	const isLogged = !!localStorage.getItem('app-token');
	return isLogged ? <Redirect to="/" /> : <Route {...props} />
}

export default PublicRoute;
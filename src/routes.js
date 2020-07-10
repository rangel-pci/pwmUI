import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import PrivateRoute from './components/privateRoute';
import PublicRoute from './components/publicRoute';

import Register from './pages/register';
import Verification from './pages/verification';
import Login from './pages/login';
import Profile from './pages/profile';
import Main from './pages/main';
import NotFound from './pages/notFound';

const Routes = () => {
	return(
		<BrowserRouter>
			<Switch>
				<PublicRoute exact path="/register" component={Register} />
				<PublicRoute exact path="/register/verification" component={Verification} />
				<PublicRoute exact path="/login" component={Login} />
				<PrivateRoute exact path="/" component={Main} />
				<PrivateRoute exact path={"/profile/:id?"} component={Profile} />

				<PrivateRoute component={NotFound} />
			</Switch>
		</BrowserRouter>
	)
}

export default Routes;
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Auth from "./screens/Auth";
import Home from "./screens/Home";
import {UserProvider} from "./shared/user";

const Main = () => {
	return (
		<UserProvider>
			<div style={{ margin: 50 }}>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/signin" component={Auth} />
					<Route path="/signup" component={Auth} />
					<Redirect from="/home" to="/" />
				</Switch>
			</div>
		</UserProvider>
	);
};

export default Main;

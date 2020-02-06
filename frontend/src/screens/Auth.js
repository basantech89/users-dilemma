import React from 'react';
import { withRouter } from 'react-router-dom';
import { authenticateUser } from "../utils/apiCaller";

const Auth = (props) => {
	const path = props.location.pathname.substring(1);
	const username = React.createRef();
	const password = React.createRef();

	const onSubmit = async (e) => {
		e.preventDefault();
		await authenticateUser(path, username.current.value, password.current.value)
			.then(user => {
				if (user && user.success) {
					if (path === 'signin') {
						localStorage.setItem('token', user.token);
						localStorage.setItem('user', username.current.value);
						props.history.push('/');
					} else {
						alert('Registered Successfully, Pl Sign In !!');
						username.current.value = null;
						password.current.value = null;
						props.history.push('/signin');
					}
				}
			});
	};
	return (
		<form onSubmit={onSubmit}>
			<div style={{ display: 'grid', gridTemplateColumns: '100px 300px' }}>
				<label htmlFor="username"> Username </label>
				<input type="text" id="username" ref={username} />
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: '100px 300px', marginTop: 30, marginBottom: 30 }}>
				<label htmlFor="pass"> Password </label>
				<input type="password" id="pass" ref={password} />
			</div>
			<button> Submit </button>
		</form>
	);
};

export default withRouter(Auth);

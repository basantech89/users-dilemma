import React from 'react';
import { Link } from "react-router-dom";
import Movies from "./Movies";

const Home = () => {
	const [user, setUser] = React.useState('');

	React.useEffect(() => {
		setUser(localStorage.getItem('user'));
		return () => setUser('');
	}, [user]);

	const logOut = () => {
		localStorage.setItem('user', '');
		localStorage.setItem('token', '');
		setUser('');
	};

	return (
		<>
			{
				user ?
					<>
						<span style={{ marginRight: 30 }}> User - {user} </span>
						<Link to="/"> <button onClick={logOut}> Logout </button> </Link>
					</>
					:
					<>
						<Link style={{ marginRight: 20 }} to="/signin"> <button> SignIn </button> </Link>
						<Link to="/signup"> <button> SignUp </button> </Link>
					</>
			}
			<Movies/>
		</>
	);
};

export default Home;

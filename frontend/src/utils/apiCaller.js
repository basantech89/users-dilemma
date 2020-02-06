import config from "../config";

export const authenticateUser = async (path, username, password) => {
	try {
		const endPoint = path === 'signin' ? config.USER_LOGIN : config.USER_SIGN_UP;
		const response = await fetch(process.env.REACT_APP_BASE_URL + endPoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});
		return await response.json();
	} catch (e) {
		console.log(e);
	}
};

export const fetchMovies = async () => {
	try {
		const response = await fetch(process.env.REACT_APP_BASE_URL + config.FETCH_MOVIES);
		return await response.json();
	} catch (error) {
		console.log(error);
	}
};

export const addComment = async (comment, movieId) => {
	try {
		const url = process.env.REACT_APP_BASE_URL + config.FETCH_MOVIES + movieId + '/' + config.ADD_COMMENT;
		let response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(comment),
		});
		return await response.json();
	} catch (e) {
		console.log(e);
	}
};

export const updateComment = async (comment, movieId, commentId) => {
	try {
		const url = process.env.REACT_APP_BASE_URL + config.FETCH_MOVIES + movieId + '/' + config.ADD_COMMENT + commentId;
		let response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(comment),
		});
		return await response.json();
	} catch (e) {
		console.log(e);
	}
};

export const removeComment = async (movieId, commentId) => {
	try {
		const url = process.env.REACT_APP_BASE_URL + config.FETCH_MOVIES + movieId + '/' + config.ADD_COMMENT + commentId;
		let response = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('token')}`
			},
		});
		return await response.json();
	} catch (e) {
		console.log(e);
	}
};

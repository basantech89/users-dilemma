import React from 'react';
import { fetchMovies } from "../utils/apiCaller";
import Form from "../components/Form";
import Comment from "./Comments";

const Movies = () => {
	const [movies, setMovies] = React.useState([]);
	// const memoizedMovies = React.useMemo(() => ({ movies, setMovies }), [movies]);

	const getMovies = () => {
		fetchMovies()
			.then((fetchedMovies) => setMovies(fetchedMovies))
			.catch(error => console.log(error))
	};

	React.useEffect(() => {
		getMovies();
	}, []);

	const RenderMovies = movies.map(movie => (
		<div key={movie._id} style={{ marginTop: 30 }}>
			<h4 style={{ display: 'inline' }}> {movie.name} </h4>
			<Form
				title="Add a Comment"
				state={false}
				movieId={movie._id}
				getMovies={getMovies}
				thisComment={{ comment: null, rating: null, author: null }}
			/>
			<Comment getMovies={getMovies} movieId={movie._id} comments={movie.comments} />
		</div>
	));

	return (
		<>
			<p> Movies List </p>
			{RenderMovies}
		</>
	);
};

export default Movies;

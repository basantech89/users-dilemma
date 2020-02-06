import React from "react";
import { addComment, updateComment, removeComment } from "../utils/apiCaller";

const Form = ({ title, state, thisComment, getMovies, movieId, commentId }) => {
	const user = localStorage.getItem('user');
	const [fieldState, setField] = React.useState(false);
	const [modal, setModalState] = React.useState(state);
	const [add, setAdd] = React.useState(false);
	const rating = React.useRef();
	const comment = React.useRef();

	const toggle = (e) => {
		e.preventDefault();
		setModalState(!modal);
		setAdd(!add);
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const newComment = { rating: rating.current.value, comment: comment.current.value };
		addComment(newComment, movieId)
			.then(() => getMovies())
			.catch(error => console.log(error));
		setModalState(!modal);
		rating.current.value = null;
		comment.current.value = null;
		setAdd(!add);
	};

	const editComment = () => {
		rating.current.focus();
		const updatedComment = { rating: rating.current.value, comment: comment.current.value };
		updateComment('PUT', updatedComment, movieId, commentId)
			.then(() => getMovies())
			.catch(error => console.log(error));
		setField(!fieldState);
	};

	const deleteComment = (e) => {
		e.preventDefault();
		removeComment(movieId, commentId)
			.then(() => getMovies())
			.catch(error => console.log(error));
	};

	const RenderButtons = () => {
		if (title) {
			return <button onClick={onSubmit} style={{ marginTop: 20 }}> Submit </button>;
		} else if (user === thisComment.author) {
			return (
				<>
					<button onClick={editComment} style={{ marginRight: 20 }}> { fieldState ? 'Submit' : 'Edit' } </button>
					<button onClick={deleteComment} style={{ marginRight: 20 }}> Delete </button>
				</>
			);
		} else return <div/>
	};

	return (
		<form style={{ display: 'inline', marginLeft: 30 }}>
			<button onClick={toggle} style={{ visibility: user && !state ? 'visible' : 'hidden', marginBottom: 30 }}> {title} </button>
			<div style={{ display: modal ? 'block' : 'none' }}>
				<div style={{ display: 'grid', gridTemplateColumns: '100px 100px', gridTemplateRows: '30px', marginBottom: 20 }}>
					<span> Rating </span>
					<input type="number" min="1" max="10" ref={rating} disabled={!add && (!fieldState || user !== thisComment.author)} defaultValue={thisComment.rating} /> <br/>
				</div>
				<div style={{ display: 'grid', gridTemplateColumns: '100px 200px' }}>
					<span> Comment </span>
					<textarea disabled={!add && (!fieldState || user !== thisComment.author)} ref={comment} defaultValue={thisComment.comment} required />
				</div>
				<div style={{ display: state && modal ? 'grid' : 'none', gridTemplateColumns: '100px 100px', marginBottom: 20 }}>
					<p> By </p>
					<p> {thisComment.author} </p> <br/>
				</div>
				<RenderButtons/>
			</div>
		</form>
	);
};

export default Form;

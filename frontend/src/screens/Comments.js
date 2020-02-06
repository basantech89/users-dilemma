import React from "react";
import Form from "../components/Form";

const Comment = ({ comments, movieId, getMovies }) => {
	let thisComment;
	return comments.map(comment => {
		thisComment = { comment: comment.comment, rating: comment.rating, author: comment.author.username };
		return (
			<React.Fragment key={comment._id}>
				<Form
					movieId={movieId}
					state={true}
					getMovies={getMovies}
					thisComment={thisComment}
					commentId={comment._id}
				/>
			</React.Fragment>
		)
	});
};

export default Comment;

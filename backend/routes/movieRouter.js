const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Movies = require('../models/movies');

const movieRouter = express.Router();
movieRouter.use(bodyParser.json());

movieRouter.route('/')
	.get((req, res, next) => {
		Movies.find().populate('comments.author')
			.then(movies => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(movies);
			}, err => next(err))
			.catch(err => next(err));
	})
	.post(authenticate.verifyUser, authenticate.verifyResourceAccess, (req, res, next) => {
		Movies.create(req.body)
			.then(movie => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(movie);
			}, err => next(err))
			.catch(err => next(err));
	})
	.put(authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on this resource');
	})
	.delete(authenticate.verifyUser, authenticate.verifyResourceAccess, (req, res, next) => {
		Movies.remove({})
			.then(response => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			}, err => next(err))
			.catch(err => next(err));
	});

movieRouter.route('/:movieId')
	.get((req, res, next) => {
		Movies.findById(req.params.movieId)
			.populate('comments.author')
			.then(movie => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(movie);
			}, err => next(err))
			.catch(err => next(err));
	})
	.post(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end('POST operation not supported on /movies/' + req.params.movieId);
	})
	.put(authenticate.verifyUser, authenticate.verifyResourceAccess, (req, res, next) => {
		Movies.findByIdAndUpdate(req.params.movieId, { $set: req.body }, { new: true })
			.then(movie => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(movie);
			}, err => next(err))
			.catch(err => next(err));
	})
	.delete(authenticate.verifyUser, authenticate.verifyResourceAccess, (req, res, next) => {
		Movies.findByIdAndRemove(req.params.movieId)
			.then(movie => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(movie);
			}, err => next(err))
			.catch(err => next(err));
	});

movieRouter.route('/:movieId/comments')
	.get((req, res, next) => {
		Movies.findById(req.params.movieId)
			.populate('comments.author')
			.then(movie => {
				if (movie) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(movie.comments);
				} else {
					const error = new Error('Movie ' + req.params.movieId + ' not found');
					error.statusCode = 404;
					return next(error);
				}
			}, err => next(err))
			.catch(err => next(err));
	})
	.post(authenticate.verifyUser, authenticate.verifyBasicAccess, (req, res, next) => {
		Movies.findById(req.params.movieId)
			.then(movie => {
				if (movie) {
					req.body.author = req.user._id;
					movie.comments.push(req.body);
					movie.save()
						.then(movie => {
							Movies.findById(movie._id)
								.then(movie => {
									res.statusCode = 200;
									res.setHeader('Content-Type', 'application/json');
									res.json(movie);
								}, err => next(err))
								.catch(err => next(err));
						})
				} else {
					const error = new Error('Movie ' + req.params.movieId + ' not found');
					error.statusCode = 404;
					return next(error);
				}
			}, err => next(err))
			.catch(err => next(err));
	})
	.put(authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /movies/' + req.params.movieId + '/comments');
	})
	.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Movies.findById(req.params.movieId)
			.then(movie => {
				if (movie) {
					for (let i = movie.comments.length - 1; i >= 0; i--) {
						movie.comments.id(movie.comments[i]._id).remove();
					}
					movie.save()
						.then(movie => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(movie);
						}, error => next(error))
						.catch(error => next(error));
				} else {
					const error = new Error('Movie ' + req.params.movieId + ' not found');
					error.statusCode = 404;
					return next(error);
				}
			}, error => next(error))
			.catch(error => next(error));
	});

movieRouter.route('/:movieId/comments/:commentId')
	.get((req, res, next) => {
		Movies.findById(req.params.movieId)
			.populate('comments.author')
			.then(movie => {
				if (movie && movie.comments.id(req.params.commentId)) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(movie.comments.id(req.params.commentId));
				} else if (!movie) {
					const error = new Error('Movie ' + req.params.movieId + ' not found');
					error.statusCode = 404;
					return next(error);
				} else {
					const error = new Error('Comment ' + req.params.commentId + ' not found');
					error.statusCode = 404;
					return next(error);
				}
			}, error => next(error))
			.catch(error => next(error));
	})
	.post(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end('POST operation not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId);
	})
	.put(authenticate.verifyUser, authenticate.verifyBasicAccess, (req, res, next) => {
		Movies.findById(req.params.movieId)
			.then(movie => {
				if (movie && movie.comments.id(req.params.commentId)) {
					if (movie.comments.id(req.params.commentId).author.equals(req.user._id)) {
						if (req.body.rating) {
							movie.comments.id(req.params.commentId).rating = req.body.rating;
						}
						if (req.body.comment) {
							movie.comments.id(req.params.commentId).comment = req.body.comment;
						}
						movie.save()
							.then(response => {
								res.statusCode = 200;
								res.setHeader('Content-Type', 'application/json');
								res.json(response);
							})
					} else {
						const error = new Error('You are not authorized to update this comment');
						error.statusCode = 404;
						return next(error);
					}
				} else if (!movie) {
					const err = new Error('Movie ' + req.params.movieId + ' not found');
					err.statusCode = 404;
					return next(err);
				} else {
					const err = new Error('Comment  ' + req.params.commentId + ' not found');
					err.statusCode = 404;
					return next(err);
				}
			}, error => next(error))
			.catch(error => next(error));
	})
	.delete(authenticate.verifyUser, authenticate.verifyBasicAccess, (req, res, next) => {
		Movies.findById(req.params.movieId)
			.then(movie => {
				if (movie && movie.comments.id(req.params.commentId)) {
					if (movie.comments.id(req.params.commentId).author.equals(req.user._id)) {
						movie.comments.id(req.params.commentId).remove();
						movie.save()
							.then(movie => {
								res.statusCode = 200;
								res.setHeader('Content-Type', 'application/json');
								res.json(movie);
							})
							.catch(error => next(error));
					} else {
						const error = new Error('You are not authorized to delete this comment!');
						error.statusCode = 404;
						return next(error);
					}
			} else if (!movie) {
					const err = new Error('Movie ' + req.params.movieId + ' not found');
					err.statusCode = 404;
					return next(err);
				} else {
					const err = new Error('Comment  ' + req.params.commentId + ' not found');
					err.statusCode = 404;
					return next(err);
				}
			}, error => next(error))
			.catch(error => next(error));
	});

module.exports = movieRouter;

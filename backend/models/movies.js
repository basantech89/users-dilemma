const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	rating: {
		type: Number,
		min: 1,
		max: 10,
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectID,
		ref: 'User',
	}
});

const movieSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	comments: [ commentSchema ],
}, {
	timestamps: true,
});

const Movies = mongoose.model('Movie', movieSchema);

module.exports = Movies;

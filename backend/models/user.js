const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    role: {
        type: String,
        default: 'basic', // '', basic, creator, admin
    },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);

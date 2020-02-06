const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user => jwt.sign(user, config.secretKey, { expiresIn: 86400 });
const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.secretKey,
};

const verify = (jwt_payload, cb) => {
	User.findOne({ _id: jwt_payload._id }, (err, user) => {
		if (err) {
			return cb(err, false);
		} else if (user) {
			return cb(null, user);
		}
		return cb(null, false);
	});
};

exports.jwtPassport = passport.use(new JwtStrategy(options, verify));
exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyBasicAccess = (req, res, next) => {
	if (req.user.role === "basic") {
		return next();
	} else {
		const error = new Error('You are not authorized to perform this operation!');
		error.status = 403;
		return next(error);
	}
};

exports.verifyResourceAccess = (req, res, next) => {
	if (req.user.role === "creator" || req.user.role === "admin") {
		return next();
	} else {
		const error = new Error('You are not authorized to modify this resource!');
		error.status = 403;
		return next(error);
	}
};

exports.verifyAdmin = (req, res, next) => {
	if (req.user.role === "admin") {
		return next();
	} else {
		const error = new Error('Only admin has access to this resource!');
		error.status = 403;
		return next(error);
	}
};

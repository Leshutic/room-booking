const routes = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AnonymIdStrategy = require('passport-anonym-uuid').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('../models').users;
const tokens = require('../constants/tokens');
const config = require('../config/main');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const localStorage = require('localStorage');

// Local Strategy for authorization
passport.use(new LocalStrategy(
    (username, password, done) => {
        users.find({ where: { username: username }})
            .then((user) => {
                if (!user){
                    return done(null, false, { message: 'Wrong username' });
                } else {
                    bcrypt.compare(password, user.password, (err, success) => {
                        if (success) {
                            user.dataValues.token = jwt.sign({ id: user.id, username: user.username }, config.secret_key);

                            return done(null, user.dataValues);
                        } else {
                            return done(null, false, { message: 'Wrong password' });
                        }
                    });
                }
            })
            .catch((err) => {
                return done(err);
            })
    }
));

// Anonymus strategy for authorization
passport.use(new AnonymIdStrategy());

// Vkontakte Strategy for authorization
passport.use(new VKontakteStrategy({
        clientID: tokens.vkStrategy.appId,
        clientSecret: tokens.vkStrategy.secretKey,
        callbackURL:  `/auth/vkontakte/callback`
    },
    function(accessToken, refreshToken, params, profile, done) {
        users.findOrCreate({
            where: { provider: profile.provider, personal_id: profile.id.toString() },
            defaults: { username: profile.displayName, provider: profile.provider, personal_id: profile.id.toString(), role: 3 }
        })
            .then(user => {
                if (!user) return done(null, false);
                return done(null, user[0].dataValues);
            })
            .catch(err => {
                return done(err);
            });
    }
));

// Facebook Strategy for authorization
passport.use(new FacebookStrategy({
        clientID: tokens.FacebookStrategy.appId,
        clientSecret: tokens.FacebookStrategy.secretKey,
        callbackURL: `/auth/facebook/callback`
    },
    function(accessToken, refreshToken, params, profile, done) {
        users.findOrCreate({
            where: { provider: profile.provider, personal_id: profile.id },
            defaults: { username: profile.displayName, provider: profile.provider, personal_id: profile.id, role: 3 }
        })
            .then(user => {
                if (!user) return done(null, false);
                return done(null, user[0].dataValues);
            })
            .catch(err => {
                return done(err);
            });
    }
));

// Twitter Strategy for authorization
passport.use(new TwitterStrategy({
        consumerKey: tokens.TwitterStrategy.consumerKey,
        consumerSecret: tokens.TwitterStrategy.consumerSecret,
        callbackURL: `/auth/twitter/callback`
    },
    function(accessToken, refreshToken, profile, done) {
        users.findOrCreate({
            where: { provider: 'twitter', personal_id: profile.id },
            defaults: { username: profile.displayName, provider: 'twitter', personal_id: profile.id, role: 3 }
        })
            .then(user => {
                if (!user) return done(null, false);
                return done(null, user[0].dataValues);
            })
            .catch(err => {
                return done(err);
            });
    }
));

// Google Strategy for authorization
passport.use(new GoogleStrategy({
        clientID: tokens.GoogleStrategy.clientID,
        clientSecret: tokens.GoogleStrategy.clientSecret,
        callbackURL: '/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        users.findOrCreate({
            where: { provider: profile.provider, personal_id: profile.id },
            defaults: { username: profile.displayName, provider: profile.provider, personal_id: profile.id, role: 3 }
        })
            .then(user => {
                if (!user) return done(null, false);
                return done(null, user[0].dataValues);
            })
            .catch(err => {
                return done(err);
            });
    }
));

// Microsoft strategy for authorization
passport.use(new MicrosoftStrategy({
        clientID: tokens.MicrosoftStrategy.clientID,
        clientSecret: tokens.MicrosoftStrategy.clientSecret,
        scope: tokens.MicrosoftStrategy.scope,
        callbackURL: "http://localhost:3000/auth/microsoft/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        users.findOrCreate({
            where: { provider: profile.provider, personal_id: profile.id },
            defaults: { username: profile.displayName, provider: profile.provider, personal_id: profile.id, role: 3 }
        })
            .then(user => {
                if (!user) return done(null, false);
                return done(null, user[0].dataValues);
            })
            .catch(err => {
                return done(err);
            });
    }
));

// PASSPORT SERIALIZE USER
passport.serializeUser((user, done) => {
    done(null, user);
});

// PASSPORT DESERIALIZE USER
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Local strategy for authorization
routes.post('/local', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.status(401).json({message: 'wrong user'});

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send(user);
        });
    })(req, res, next);
});

// ROUTES FOR PASSPORT AUTHENTICATION
routes.get('/anonymus', function(req, res, next) {
    passport.authenticate('anonymId', function(err, user) {
        if (err) return next(err);
        if (!user) return res.status(401).json({message: 'wrong user'});

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            user.token = jwt.sign({ id: user.uuid }, config.secret_key);
            return res.send(user);
        });
    })(req, res, next);
});

routes.get('/vk', passport.authenticate('vkontakte'));
routes.get('/vkontakte/callback', passport.authenticate('vkontakte', { successRedirect: '/room/all', failureRedirect: '/' }));

routes.get('/fb', passport.authenticate('facebook'));
routes.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/room/all', failureRedirect: '/' }));

routes.get('/twitter', passport.authenticate('twitter'));
routes.get('/twitter/callback', passport.authenticate('twitter', { successRedirect: '/room/all', failureRedirect: '/' }));

routes.get('/google', passport.authenticate('google', { scope: ['profile'] }));
routes.get('/google/callback', passport.authenticate('google', { successRedirect: '/room/all', failureRedirect: '/' }));

routes.get('/microsoft', passport.authenticate('microsoft', { scope: ['https://graph.microsoft.com/user.read'] }));
routes.get('/microsoft/callback', passport.authenticate('microsoft', { successRedirect: '/room/all', failureRedirect: '/' }));

// ROUTE FOR LOGOUT
routes.get('/logout', (req, res) => {
    console.log(localStorage.getItem('token'));
    localStorage.clear();
    console.log(localStorage.getItem('token'));
    req.logout();
    res.redirect('/');
});

module.exports = routes;
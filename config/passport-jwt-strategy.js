const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./enviornment');
const Employee = require('../models/employee')


let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret
}


passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){

    Employee.findById(jwtPayLoad._id, function(err, employee){
        if (err){console.log('Error in finding user from JWT'); return;}

        if (employee){
            return done(null, user);
        }else{
            return done(null, false);
        }
    })

}));

module.exports = passport;

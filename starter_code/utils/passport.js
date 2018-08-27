const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')

passport.serializeUser((user, cb) => {
    cb(null, user._id)
})

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err)
        }
        const cleanUserObject = user.toObject()

        delete cleanUserObject.password

        cb(null, cleanUserObject)
    })
})

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, next) => {
            User.findOne({ email }, (err, user) => {
                if (err) {
                    return next(err)
                }
                if (!user) {
                    return next(null, false, { message: 'Incorrect username' })
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return next(null, false, { message: 'Incorrect password' })
                }

                return next(null, user)
            })
        }
    )
)
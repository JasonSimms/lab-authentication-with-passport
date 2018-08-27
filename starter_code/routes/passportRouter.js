const express        = require("express");
const passportRouter = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const flash = require('connect-flash')



// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("passport/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ "username": username },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("passport/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User({
        username,
        password: hashPass
      });
      newUser.save()
        .then(user => {
          res.redirect("/");
        })
        .catch(err => {
          res.render("auth/signup", {
            errorMessage: "Something went wrong"
          });
        });
    });
});

/*LOGIN FUNCTION */
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/private-page", 
// ensureLogin.ensureLoggedIn(), 
(req, res) => {
  // res.send('Logged in')
  res.render("passport/private", { username: req.user });
});

//LOGOUT
passportRouter.get('/signout', (req, res) => {
  req.logout()
  res.send("Logged Out!")
  // res.redirect('/')
})

/*The repo you cloned comes with a User model and a router file already made for you. It also has all the views you need there, although some are empty.

Add a new route to your passportRouter.js file with the path /signup and point it to your views/passport/signup.hbs file.

Now, in that file, add a form that makes a POST request to /signup, with a field for email and password.

Finally, add a post route to your passportRoute to receive the data from the signup form and create a new user with the data.

*/
module.exports = passportRouter;
const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})

router.post('/signup', (req, res, next) => {
  console.log('attempt to sign up')
  const { email, password } = req.body

  const encrypted = bcrypt.hashSync(password, 10)

  new User({ email, password: encrypted })
      .save()
      .then(result => {
          res.send('User account was created')
      })
      .catch(err => {
          if (err.code === 11000) {
              return res.render('sign-up', { error: 'user exists already' })
          }
          console.error(err)
          res.send('something went wrong')
      })
})
/*The repo you cloned comes with a User model and a router file already made for you. It also has all the views you need there, although some are empty.

Add a new route to your passportRouter.js file with the path /signup and point it to your views/passport/signup.hbs file.

Now, in that file, add a form that makes a POST request to /signup, with a field for username and password.

Finally, add a post route to your passportRoute to receive the data from the signup form and create a new user with the data.

*/
module.exports = router;
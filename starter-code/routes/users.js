const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find({})
    .then(responses => {
      console.log(responses)
      res.render('./users/index', {users: responses, user: req.user })
    })
    .catch(err => {
      res.render('./error', err)
    });
});

router.get('/new', (req, res, next) => {
  res.render('./users/new', {user: req.user });
});

router.get('/:id/edit',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.findOne({_id: req.params.id})
    .then(course => {
      res.render('./users/edit', course )
    })
    .catch(err => {
      res.render('./error', err)
    })

});


router.get('/:id',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.findOne({_id : req.params.id})
    .then(course => { 
      console.log({user: req.user, course });
      res.render('./users/show', {user: req.user, course });
    })
    .catch(err => {
      res.render('./error', err)
    })
})

// router.post('/new', (req, res, next) => {
//   User.create(req.body)
//     .then(result => {
//       res.redirect('/users')
//     })
//     .catch(err => {
//       res.render('./error', err)
//     });
// });

router.post('/:id/delete', (req, res, next) => { 
  User.findOneAndDelete({_id : req.params.id})
    .then(result => {
      res.redirect('/users');
    })
    .catch(err => {
      res.render('./error', err)
    })
});


router.post('/:id/edit', (req, res, next) => {

  User.findOneAndUpdate({_id: req.params.id} , req.body)
    .then(result => {
      console.log('curso actualizadao:', result);
      res.redirect('/users');
    })
    .catch(err => {
      console.log(err)
      res.render('./error', err)
    })
})


//

router.post("/users", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("./users", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("./users", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("./users", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});


module.exports = router;
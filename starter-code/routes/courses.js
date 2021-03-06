
const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


const Course = require('../models/course');

router.get('/',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.find({})
    .then(responses => {
      res.render('./courses/index', {courses: responses, user: req.user })
    })
    .catch(err => {
      res.render('./error', err)
    });
});

router.get('/new', (req, res, next) => {
  res.render('./courses/new', {user: req.user });
});

router.get('/:id/edit',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.findOne({_id: req.params.id})
    .then(course => {
      res.render('./courses/edit', course )
    })
    .catch(err => {
      res.render('./error', err)
    })

});


router.get('/:id',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.findOne({_id : req.params.id})
    .then(course => { 
      console.log({user: req.user, Course });
      res.render('./courses/show', {user: req.user, course });
    })
    .catch(err => {
      res.render('./error', err)
    })
})

router.post('/new', (req, res, next) => {
  Course.create(req.body.params)
    .then(result => {
      res.redirect('/courses')
    })
    .catch(err => {
      res.render('./error', err)
    });
});

router.post('/:id/delete', (req, res, next) => { 
  Course.findOneAndDelete({_id : req.params.id})
    .then(result => {
      res.redirect('/courses');
    })
    .catch(err => {
      res.render('./error', err)
    })
});


router.post('/:id/edit', (req, res, next) => {

  Course.findOneAndUpdate({_id: req.params.id} , req.body)
    .then(result => {
      console.log('curso actualizadao:', result);
      res.redirect('/courses');
    })
    .catch(err => {
      console.log(err)
      res.render('./error', err)
    })
})


module.exports = router;
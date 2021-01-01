const express = require('express')
const passport = require('passport')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync')
const users = require('../controllers/users')

//Register Routes
router.route('/register')
.get(users.renderRegisterForm)
.post(catchAsync(users.submitUserRegistration))

//Login Routes
router.route('/login')
.get(users.renderLoginForm)
.post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.LoginUser)

//Logout Route
router.get('/logout', users.logoutUser)

module.exports = router
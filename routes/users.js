const express = require('express')
const passport = require('passport')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync')
const User = require('../models/user')

//Register Routes
router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async(req, res, next) => {
    try{
        const { email, username, password } = req.body
        const user = new User({
            email, 
            username
        })
        //takes the user we just created above, and it's password, hashes the password and stores the hash/salt result on the new user.
        const registeredUser = await User.register(user, password)
        //this will log the user in directly after he/she registers
        req.login(registeredUser, err => {
            if (err) {
                return next(err) 
            } else {
                req.flash('success', 'Welcome to YelpCamp')
                res.redirect('/campgrounds')
        }})
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}))

//Login Routes
router.get('/login', (req, res) => {
    res.render('users/login')
})
//if there is a failure or user can't log in, an error (failure) msg will flash and user will be redirected back to the login page
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back')
    res.redirect('/campgrounds')
})

//Logout Route
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'You successfully logged out')
    res.redirect('/login')
})





module.exports = router
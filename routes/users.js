const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync')
const User = require('../models/user')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async(req, res) => {
    const { email, username, password } = req.body
    const user = new User({
        email, 
        username
    })
    //takes the user we just created above, and it's password, hashes the password and stores the hash/salt result on the new user.
    const registeredUser = await User.register(user, password)
    console.log(registeredUser)
    req.flash('success', 'Welcome to YelpCamp')
    res.redirect('/campgrounds')
}))

module.exports = router
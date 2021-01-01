const User = require('../models/user')

//REGISTER
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.submitUserRegistration = async(req, res, next) => {
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
}

//LOGIN
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.LoginUser = (req, res) => {
    req.flash('success', 'Welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    //deletes returnTo from the session object
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

//LOGOUT
module.exports.logoutUser = (req, res) => {
    req.logout()
    req.flash('success', 'You successfully logged out')
    res.redirect('/login')
}
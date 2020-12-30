//DEPENDENCIES
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utilities/ExpressError.js')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')





const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes= require('./routes/reviews')


//CONNECT TO MONGOOSE
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})
//CHECK IF CONNECTION HAS ERRORS OR IS SUCCESSFUL
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
	console.log('Database connected')
})

const app = express()

//SET VIEW ENGINE TO EJS
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//HELPS WITH FORM SUBMISSIONS
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
	secret: 'thisisasecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
//make sure to put use session before passport.session
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
//needed to have persistent login sessions
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
//how to store a user in the session
passport.serializeUser(User.serializeUser())
//how to unstore a user in the session
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
	//this allows us to have access, in all templates, to the current user
	res.locals.currentUser = req.user
	res.locals.success = req.flash('success')
	res.locals.error = req.flash('error')
	next()
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

//HOME ROUTE
app.get('/', (req, res) => {
	res.render('home')
})



//ERROR HANDLING
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
	const {statusCode = 500} = err
	if(!err.message) err.message = 'Oh no, something went wrong!'
	res.status(statusCode).render('error', {err})
})


app.listen(3000, () => {
	console.log('Server is up and running')
})




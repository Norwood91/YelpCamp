//DEPENDENCIES
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utilities/catchAsync.js')
const ExpressError = require('./utilities/ExpressError.js')
const methodOverride = require('method-override')
const Campground = require('./models/campground.js')

//CONNECT TO MONGOOSE
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
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

//RESTful ROUTES BELOW
app.get('/', (req, res) => {
	res.render('home')
})
//INDEX ROUTE
app.get('/campgrounds', catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', { campgrounds })
}))

//CREATE ROUTE
app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new')
})

app.post('/campgrounds', catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground)
		await campground.save()
		res.redirect(`/campgrounds/${campground._id}`)
}))

//SHOW ROUTE
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id)
	res.render('campgrounds/show', { campground })
}))

//EDIT ROUTE
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id)
	res.render('campgrounds/edit', { campground })
}))

//UPDATE ROUTE
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
	const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground})
	res.redirect(`/campgrounds/${campground._id}`)
}))

//DELETE ROUTE
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
	const campground = await Campground.findByIdAndDelete(req.params.id)
	res.redirect('/campgrounds')
}))

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
	const {statusCode = 500, message = 'Something went wrong'} = err
	res.status(statusCode).send(message)
})


app.listen(3000, () => {
	console.log('Server is up and running')
})




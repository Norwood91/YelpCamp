//DEPENDENCIES
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const catchAsync = require('./utilities/catchAsync.js')
const ExpressError = require('./utilities/ExpressError.js')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalPassport = require('passport-local')
const Review = require('./models/review')






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


const campgrounds = require('./routes/campgrounds')
app.use('/campgrounds', campgrounds)

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body)
	if(error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next()
	}
}



//RESTful ROUTES BELOW
app.get('/', (req, res) => {
	res.render('home')
})


//REVIEW POST ROUTE
app.post('/campgrounds/:id/reviews', validateReview, catchAsync (async(req, res) => {
	//finds the campground
	const campground = await Campground.findById(req.params.id)
	//creates the new review
	const review = new Review(req.body.review)
	//push the newly created review to the campground's reviews array
	campground.reviews.push(review)
	await review.save()
	await campground.save()
	res.redirect(`/campgrounds/${campground._id}`)
}))

//REVIEW DELETE ROUTE
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync (async(req, res) => {
	//destructure the params
	const { id, reviewId } = req.params
	//we find the campground by the ID then
	//we PULL from that campground's REVIEWS array, the ID of the review we want to delete
	await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId }})
	//then we delete the review 
	await Review.findByIdAndDelete(reviewId)
	res.redirect(`/campgrounds/${id}`)
}))



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




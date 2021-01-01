const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync.js')
const Campground = require('../models/campground.js')
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')


//INDEX ROUTE
router.get('/', catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', { campgrounds })
}))

//CREATE ROUTE
router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground)
		//this associates the new campground to a specific user, by the user id
		campground.author = req.user._id
		await campground.save()
		req.flash('success', 'Succesfully created a new campground')
		res.redirect(`/campgrounds/${campground._id}`)
}))

//SHOW ROUTE
router.get('/:id', catchAsync(async (req, res) => {
	// find the campground by it's id, then populate all of the reviews for that campground, then populate the author of each review.
	//lastly populate the author of the entire campground
	const campground = await (await Campground.findById(req.params.id).populate({path:'reviews', populate:{path:'author'}}).populate('author'))

	if(!campground) {
		req.flash('error', "This campground doesn't exist")
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/show', { campground })
}))


//EDIT ROUTE
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findById(id)
	if(!campground) {
		req.flash('error', "This campground doesn't exist")
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/edit', { campground })
}))

//UPDATE ROUTE
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground})
	req.flash('success', 'Successfully updated campground')
	res.redirect(`/campgrounds/${id}`)
}))

//DELETE ROUTE
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
	//destructure the params
	const {id} = req.params
	const campground = await Campground.findByIdAndDelete(id)
	req.flash('success', 'Successfully deleted campground')
	res.redirect('/campgrounds')
}))


module.exports = router
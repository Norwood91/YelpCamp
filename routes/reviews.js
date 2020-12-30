const express = require('express')
//merges all of the params from the campgrounds file into the review params in this file. So we have access to the campgrounds params.
const router = express.Router({mergeParams: true})


const Campground = require('../models/campground.js')
const Review = require('../models/review')


const { reviewSchema } = require('../schemas.js')


const ExpressError = require('../utilities/ExpressError.js')
const catchAsync = require('../utilities/catchAsync.js')




const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body)
	if(error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next()
	}
}


//REVIEW POST ROUTE
router.post('/', validateReview, catchAsync (async(req, res) => {
	//finds the campground
	const campground = await Campground.findById(req.params.id)
	//creates the new review
	const review = new Review(req.body.review)
	//push the newly created review to the campground's reviews array
	campground.reviews.push(review)
	await review.save()
	await campground.save()
	//Shows message that your review was successfully created
	req.flash('success', 'Successfully created new review')
	res.redirect(`/campgrounds/${campground._id}`)
}))

//REVIEW DELETE ROUTE
router.delete('/:reviewId', catchAsync (async(req, res) => {
	//destructure the params
	const { id, reviewId } = req.params
	//we find the campground by the ID then
	//we PULL from that campground's REVIEWS array, the ID of the review we want to delete
	await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId }})
	//then we delete the review 
	await Review.findByIdAndDelete(reviewId)
	//flashes message when you successfully delete a review
	req.flash('success', 'Successfully deleted your review')
	res.redirect(`/campgrounds/${id}`)
}))


module.exports = router
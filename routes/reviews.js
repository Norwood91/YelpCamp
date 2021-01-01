const express = require('express')
//merges all of the params from the campgrounds file into the review params in this file. So we have access to the campgrounds params.
const router = express.Router({mergeParams: true})
const Campground = require('../models/campground.js')
const Review = require('../models/review')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const ExpressError = require('../utilities/ExpressError.js')
const catchAsync = require('../utilities/catchAsync.js')




//REVIEW POST ROUTE
router.post('/', isLoggedIn, validateReview, catchAsync (async(req, res) => {
	//finds the campground
	const campground = await Campground.findById(req.params.id)
	//creates the new review
	const review = new Review(req.body.review)
	//set the author of the review to the current user
	review.author = req.user._id
	//push the newly created review to the campground's reviews array
	campground.reviews.push(review)
	await review.save()
	//since we're storing a reference of the review in the campground's reviews array, we save the campground here as well
	await campground.save()
	//Shows message that your review was successfully created
	req.flash('success', 'Successfully created new review')
	res.redirect(`/campgrounds/${campground._id}`)
}))

//REVIEW DELETE ROUTE
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync (async(req, res) => {
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
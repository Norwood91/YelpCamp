const Review = require('../models/review')
const Campground = require('../models/campground.js')


module.exports.newReview = async(req, res) => {
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
}

module.exports.deleteReview = async(req, res) => {
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
}
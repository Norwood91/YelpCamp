const express = require('express')
//merges all of the params from the campgrounds file into the review params in this file. So we have access to the campgrounds params.
const router = express.Router({mergeParams: true})
const ExpressError = require('../utilities/ExpressError.js')
const catchAsync = require('../utilities/catchAsync.js')
const reviews = require('../controllers/reviews')


const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')


//REVIEW POST ROUTE
router.post('/', isLoggedIn, validateReview, catchAsync (reviews.newReview))

//REVIEW DELETE ROUTE
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync (reviews.deleteReview))


module.exports = router
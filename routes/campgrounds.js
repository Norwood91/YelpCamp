const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync.js')
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
var multer  = require('multer')
const {storage} = require('../cloudinary/index')
var upload = multer({ storage })

router.route('/')
.get(catchAsync(campgrounds.indexPage))
.post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createNewCampground))

//CREATE ROUTE
router.get('/new', isLoggedIn, campgrounds.newCampgroundForm)

//SHOW ROUTE
router.route('/:id')
.get(catchAsync(campgrounds.campgroundShowPage))
.put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

//EDIT ROUTE
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.campgroundEditForm))

module.exports = router
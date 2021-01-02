const Campground = require('../models/campground.js')
const { cloudinary } = require('../cloudinary')

module.exports.indexPage = async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', { campgrounds })
}

module.exports.newCampgroundForm = (req, res) => {
	res.render('campgrounds/new')
}

module.exports.createNewCampground = async (req, res, next) => {
	const campground = new Campground(req.body.campground)
	//map over the array, take only the PATH and FILENAME, make a new object for each one and put that in an array, so we end up with an array of however many uploaded images from the user, we then add it to the campground
	campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    //this associates the new campground to a specific user, by the user id
    campground.author = req.user._id
	await campground.save()
    req.flash('success', 'Succesfully created a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.campgroundShowPage = async (req, res) => {
	// find the campground by it's id, then populate all of the reviews for that campground, then populate the author of each review.
	//lastly populate the author of the entire campground
	const campground = await (await Campground.findById(req.params.id).populate({path:'reviews', populate:{path:'author'}}).populate('author'))

	if(!campground) {
		req.flash('error', "This campground doesn't exist")
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/show', { campground })
}

module.exports.campgroundEditForm = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findById(id)
	if(!campground) {
		req.flash('error', "This campground doesn't exist")
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
	const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
	//use spread operator to pass the DATA from the array into the push method, so we don't push the ENTIRE array
	//essentially, this pushes the newly uploaded photos to the images array, instead of overwriting the existing images
	campground.images.push(...imgs)
	await campground.save()
	//if there are any images being deleted
	if (req.body.deleteImages) {
		//for every filename in the delete request
		for(let filename of req.body.deleteImages) {
			//destroy(delete) the image with that filename in cloudinary
			cloudinary.uploader.destroy(filename)
		}
		//we are pulling out of the images array, any image who's filename is IN the delete request. That/those images will be deleted
		await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages}}}})
		console.log(campground)
	}
	req.flash('success', 'Successfully updated campground')
	res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
	//destructure the params
	const {id} = req.params
	const campground = await Campground.findByIdAndDelete(id)
	req.flash('success', 'Successfully deleted campground')
	res.redirect('/campgrounds')
}
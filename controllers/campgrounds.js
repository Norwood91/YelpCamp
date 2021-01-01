const Campground = require('../models/campground.js')

module.exports.indexPage = async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', { campgrounds })
}

module.exports.newCampgroundForm = (req, res) => {
	res.render('campgrounds/new')
}

module.exports.createNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground)
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
	const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground})
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
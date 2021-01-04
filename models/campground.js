const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema
//options to include virtuals set to true
const opts = {toJSON: {virtuals: true}}

const ImageSchema = new Schema({
	url: String,
	filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
	return this.url.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema({
	title: String,
	//images is now an array of images, using the above ImageSchema
	images: [ImageSchema],
	geometry: {
		type:{
			type: String,
			//must be set to point
			enum: ['Point'],
			required: true
		},
		coordinates: {
			//array of numbers
			type: [Number],
			required: true
		}
	},
	price: Number,
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref:'Review'
		}

	]
}, opts)





CampgroundSchema.virtual('properties.popupMarkup').get(function() {
	return `
	<a href="/campgrounds/${this._id}" style="text-decoration: none;">${this.title}</a>
	<p>${this.description.substring(0,45)}...</p>

	`
})




//Find a campground
CampgroundSchema.post('findOneAndDelete', async function (doc) {
	// if there is a campground
	if (doc) {
		await Review.deleteMany({
			//if there are any reviews with the matching review id within the campgrounds REVIEWS array, delete them all
			_id: {
				$in: doc.reviews
			}
		})
	}
})

module.exports = mongoose.model('Campground', CampgroundSchema)
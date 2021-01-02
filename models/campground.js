const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

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
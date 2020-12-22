const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema


const CampgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
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
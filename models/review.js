const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ReviewSchema = new Schema({
	body: String,
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,
		//reference to User model
		ref: 'User'
	}
})

module.exports = mongoose.model('Review', ReviewSchema)
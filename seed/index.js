const mongoose = require('mongoose')
const Campground = require('../models/campground.js')
const {places, descriptors} = require('./seedHelpers')
const cities = require('./cities')


//connect to mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
})

const db = mongoose.connection
//show error
db.on('error', console.error.bind(console, 'connection error'))
//if successful console.log database connected
db.once('open', () => {
	console.log('Database connected')
})

const sample = (array) => {
	//picks and returns a random element from an array
	return array[Math.floor(Math.random() * array.length)]
}

//Seed file logic
const seedDB = async() => {
	//delete any campgrounds in the database 
	await Campground.deleteMany({})
	//loop 50 times to create 50 seed campgrounds for testing purposes
	for(let i = 0; i < 50; i++) {
		//get a random number from 1 - 1000
		const random1000 = Math.floor(Math.random() * 1000)
		//create new campground 
		const camp = new Campground({
			//get a random city and random state from the cities.js file
			location:`${cities[random1000].city}, ${cities[random1000].state}`,
			//create a random title for the campground
			title: `${sample(descriptors)} ${sample(places)}`
		})
		//save the seeded campgrounds
		await camp.save()
	}
}

seedDB().then(() => {
	mongoose.connection.close()
})
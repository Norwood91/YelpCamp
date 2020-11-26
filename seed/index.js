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

		const price = Math.floor(Math.random() * 20 ) + 10;
		//create new campground 
		const camp = new Campground({
			//get a random city and random state from the cities.js file
			location:`${cities[random1000].city}, ${cities[random1000].state}`,
			//create a random title for the campground
			title: `${sample(descriptors)} ${sample(places)}`,
			//get a random image for all the temp campgrounds
			image: 'https://source.unsplash.com/collection/483251',
			description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
			price: price
		})
		//save the seeded campgrounds
		await camp.save()
	}
}

seedDB().then(() => {
	mongoose.connection.close()
})
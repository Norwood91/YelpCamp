const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Campground = require('./models/campground.js')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
	console.log('Database connected')
})

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
	res.render('home')
})
//INDEX ROUTE
app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', { campgrounds })
})

//CREATE ROUTE
app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
	const campground = new Campground(req.body.campground)
	await campground.save()
	res.redirect(`/campgrounds/${campground._id}`)
})

//SHOW ROUTE
app.get('/campgrounds/:id', async (req, res) => {
	const campground = await Campground.findById(req.params.id)
	res.render('campgrounds/show', { campground })
})

//EDIT ROUTE
app.get('/campgrounds/:id/edit', async (req, res) => {
	const campground = await Campground.findById(req.params.id)
	res.render('campgrounds/edit', { campground })
})

//UPDATE ROUTE
app.put('/campgrounds/:id', async (req, res) => {
	const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground})
	res.redirect(`/campgrounds/${campground._id}`)
})







app.listen(3000, () => {
	console.log('Server is up and running')
})




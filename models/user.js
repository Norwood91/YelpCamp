const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

Schema = mongoose.Schema

const UserSchema = new Schema({
	email: {
		type: String, 
		required: true,
		unique: true
	}
})
//adds onto schema a username, password field

UserSchema.plugin(passportLocalMongoose)



module.exports = mongoose.model('User', UserSchema)
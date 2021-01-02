const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//Links to my particular cloudinary account
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env. CLOUDINARY_SECRET
})

//Set up an instance of a cloudinary storage, that will be passed to multer
const storage = new CloudinaryStorage({
    //pass in the cloudinary object we configured above
    cloudinary,
    params: {
    //this is the name of the folder in cloudinary that we should store files in
        folder: 'Yelpcamp',
        allowedFormats: ['jpeg, png, jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}
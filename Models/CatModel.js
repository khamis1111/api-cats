// Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://khamis:khamis@cluster0.wk82dwz.mongodb.net/Cats');
// Model
const Cat = mongoose.model('Cat', { name: String });

module.exports = Cat
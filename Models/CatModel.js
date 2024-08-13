// Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Cats');
// Model
const Cat = mongoose.model('Cat', { name: String });

module.exports = Cat
const mongoose = require('mongoose');

let genreSchema = mongoose.Schema({
    Name: String,
    Description: String
});

let directorSchema = mongoose.Schema({
    Name: String,
    Bio: String
});

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    Director: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Director'
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

let Movie = mongoose.model('Movie', movieSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;
const express = require('express'),
       morgan = require('morgan'),
   bodyParser = require('body-parser'),
         uuid = require('uuid'),
          app = express();
app.use(bodyParser.urlencoded({ extended: true}));
         const PORT = 8080;
         mongoose = require('mongoose'),
         Models = require('./models.js'),
         Movies = Models.Movie,
         Users = Models.User,
         Genres = Models.Genre,
         Directors = Models.Director;

app.use(bodyParser.json());
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//CREATE
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//READ
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
      .populate('Genre')
      .populate('Director')
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.title})
      .populate('Genre')
      .populate('Director')
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
    Genres.find()
      .then((genres) => {
        res.status(200).json(genres);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

  app.get('/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Genres.findOne({ name: req.params.name})
      .then((genres) => {
        res.status(200).json(genres);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  app.get('/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Directors.findOne({ Name: req.params.name})
      .then((directors) => {
        res.status(200).json(directors);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//UPDATE
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }
    )
    .then(updatedUser => {
        res.json(updatedUser);
    })
    .catch(e => {
        console.error(e);
        res.status(500).send('Error: ' + e)
    });
  });

  app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then(updatedUser => {
        res.json(updatedUser);
      })
      .catch(e => {
        console.error(e);
        res.status(500).send('Error: ' + e);
      });
  });

//DELETE
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $pull: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }
     )
     .then(updatedUser => {
       res.json(updatedUser);
     })
     .catch(e => {
       console.error(e);
       res.status(500).send('Error: ' + e);
     });
 });

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }),(req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((e) => {
        console.error(e);
        res.status(500).send('Error: ' + e);
      });
  });



const connectDB = async () => {
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to database sucesfully");
    } catch (e) {
        console.log(e);
    }
}

connectDB();


app.listen(PORT, (e) => {
    if (e) console.log(e);
    console.log("Server listening on PORT", PORT);
});

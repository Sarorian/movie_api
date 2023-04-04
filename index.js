const express = require('express'),
       morgan = require('morgan');
const app = express();
const PORT = 8080;

let topMovies = [
    {'title': 'Tenet'},
    {'title': 'Interstellar'},
    {'title': 'Inception'},
    {'title': 'Now You See Me'},
    {'title': 'The Shawshank Redemption'},
    {'title': 'Slumdog Millionaire'},
    {'title': 'The Prestige'},
    {'title': 'Harry Potter and the Goblet of Fire'},
    {'title': 'Moana'},
    {'title': 'Catch Me If You Can'},
];

app.use(morgan('common'));
app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('My top 10 movies');
});

app.listen(PORT, (e) => {
    if (e) console.log(e);
    console.log("Server listening on PORT", PORT);
});

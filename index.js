const express = require('express'),
       morgan = require('morgan'),
   bodyParser = require('body-parser'),
         uuid = require('uuid'),
          app = express(),
         PORT = 8080;

app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: "Kim",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Joe",
        favoriteMovies: ["Now You See Me"]
    },
];

let movies = [
    {
        Title: "The Shawshank Redemption",
        Description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        Genre: {
          Name: "Drama",
          Description: "A serious narrative work that presents a realistic portrayal of characters within a social or emotional context."
        },
        Director: {
          Name: "Frank Darabont",
          Bio: "Frank Darabont is an American film director, screenwriter, and producer. He is best known for directing the films The Shawshank Redemption, The Green Mile, and The Mist.",
          Birth: 1959
        },
        ImageURL: "https://cdn.shopify.com/s/files/1/0057/3728/3618/products/shawshank.128000_480x.progressive.jpg?v=1590097750",
        Featured: true
    },
    {
        Title: "Interstellar",
        Description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        Genre: {
          Name: "Sci-Fi",
          Description: "A genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science."
        },
        Director: {
          Name: "Christopher Nolan",
          Bio: "Christopher Nolan is a British-American film director, producer, and screenwriter. He is known for his work on films such as Memento, The Dark Knight Trilogy, and Inception.",
          Birth: 1970
        },
        ImageURL: "https://cdn.shopify.com/s/files/1/0057/3728/3618/products/interstellar3_480x.progressive.jpg?v=1585846947",
        Featured: true
    },
    {
        Title: "Now You See Me",
        Description: "An FBI agent and an Interpol detective track a team of illusionists who pull off bank heists during their performances and reward their audiences with the money.",
        Genre: {
          Name: "Thriller",
          Description: "A genre that uses suspense, tension, and excitement as the main elements to keep the audience engaged."
        },
        Director: {
          Name: "Louis Leterrier",
          Bio: "Louis Leterrier is a French film director, producer, and screenwriter. He is known for his work on films such as The Transporter, The Incredible Hulk, and Clash of the Titans.",
          Birth: 1973
        },
        ImageURL: "https://cdn.shopify.com/s/files/1/0057/3728/3618/products/5b47e5155dccae8898a0f8a0b4beadb8_1518d8a7-a7da-4619-896b-2f6d1c0ec541_480x.progressive.jpg?v=1573594003",
        Featured: false
    },
    {
        Title: "Tenet",
        Description: "A secret agent is tasked with preventing World War III through time travel.",
        Genre: {
          Name: "Action",
          Description: "A genre that emphasizes physical stunts, chases, and fights as the main elements to keep the audience engaged."
        },
        Director: {
          Name: "Christopher Nolan",
          Bio: "Christopher Nolan is a British-American film director, producer, and screenwriter. He is known for his work on films such as Memento, The Dark Knight Trilogy, and Inception.",
          Birth: 1970
        },
        ImageURL: "https://cdn.shopify.com/s/files/1/0057/3728/3618/products/tenet_qrxqcp6m_480x.progressive.jpg?v=1666280263",
        Featured: true
    },
    {
        Title: "The Avengers",
        Description: "A team of superheroes, including Iron Man, Captain America, and Thor, come together to save the world from an alien invasion.",
        Genre: {
          Name: "Action",
          Description: "A genre that emphasizes physical stunts, chases, and fights as the main elements to keep the audience engaged."
        },
        Director: {
          Name: "Joss Whedon",
          Bio: "Joss Whedon is an American film director, producer, and screenwriter. He is known for his work on films such as The Avengers, Avengers: Age of Ultron, and Serenity.",
          Birth: 1964
        },
        ImageURL: "https://cdn.shopify.com/s/files/1/0057/3728/3618/products/avengers.2436_480x.progressive.jpg?v=1647534214",
        Featured: true
    },

];

//CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('users need names');
    }
})

//READ
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie');
    }
});

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre');
    }
});

app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director');
    }
});

//UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    
    let user = users.find( user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }

})

app.put('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    
    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${user.name}'s array`);
    } else {
        res.status(400).send('no such user');
    }

})

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    
    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from ${user.name}'s array`);
    } else {
        res.status(400).send('no such user');
    }

})

app.delete('/users/:id', (req, res) => {
    const { id, } = req.params;
    
    let user = users.find( user => user.id == id);

    if (user) {
        users = users.filter( user => user.id !== id);
        res.status(200).send(`${user.name} has been deleted`);
    } else {
        res.status(400).send('no such user');
    }

})

app.listen(PORT, (e) => {
    if (e) console.log(e);
    console.log("Server listening on PORT", PORT);
});

require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res) => {
    res.render('search');
});;
// app.get('/artist/:artistID', (req, res) => {

//     res.render('artist');
// });;
app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artistSearch)
        .then(data => {
            let artistsArray = data.body.artists.items;
            // res.json(artistsArray)
            res.render('artist-search-results', {
                artistsArray
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/artist/:artistID', (req, res) => {
    // console.log(req.params.artistID)
    let id = req.params.artistID

    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            let artistAlbums = data.body
            res.render('albums', artistAlbums)
        })

})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            let artistAlbums = data.body
            // res.json(artistAlbums);
            res.render('albums', artistAlbums);
        })
});

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            let albumTracks = data.body
            // res.json(data.body);
            res.render('tracks', albumTracks);
        })
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
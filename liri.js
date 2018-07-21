//Fs package to handle read/write
var fs = require("fs");
//Store the log filename to a variable
var logFile = "log.txt";
//require twitter npm
var Twitter = require('twitter');
//require spotify npm
var Spotify = require('node-spotify-api');
//require request npm
var request = require("request");
//Keys from keys.js file
var keys = require("./keys.js");
//require fs npm
var fs = require("fs");
//Access spotify key
var spotify = new Spotify(keys.spotifyKeys);
//Access twitter key
var client = new Twitter(keys.twitterKeys);
//Gets the command for liri to perform
var command = process.argv[2];
//Gets the song or movie for liri to perform with spotify or omdb
var nodeArgs = process.argv;
let title ="";
for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        title = process.argv[3] + " " + nodeArgs[i];
    }
    else {
        title = process.argv[3];
    }
}
// console.log(command)
// console.log(title)
//Get tweet functions
var twitterTweets = function() {
    //Parameters for twitter
    var parameters = { screen_name: '@Brad94757954'};
    client.get('statuses/user_timeline', parameters, function(err, tweets, response) {
        //console.log(client)
        //If no error then retrieve tweets
        if (!err) {
            //Array to hold the twiiter info
            var twitterInfo = [];
            //Loop through the tweets and add to the tweet array
            for (let i = 0; i < tweets.length; i++) {
                twitterInfo.push({
                    'created at: ': tweets[i].created_at,
                    'Tweets: ': tweets[i].text,
                });
        }
         //Append to log file
        fs.appendFile(logFile, "\r\n"+ JSON.stringify(twitterInfo));
        console.log(twitterInfo);
       
        }
        //If there is an error then log the error
        fs.appendFile(logFile, "\r\n"+ err)
        console.log(err)
        
    });
};
//Spotify song function
function spotifySong() {
//If no song was put in-searches a default song
if (!title) {
    title = "One Call Away";
}
//Spotify constructor
spotify.search({ type: 'track', query: title }, function(err, data) {
    //If no error then search spotify
    if (!err) {
        songData = [
        
        //Console Log the response info from Spotify
        "Artist(s) Name: " + data.tracks.items[0].artists[0].name,
        "Song Title: " + data.tracks.items[0].name,
        "Song Preview: " +data.tracks.items[0].preview_url,
        "Album Name: " + data.tracks.items[0].album.name
        ]
        fs.appendFile(logFile, "\r\n"+ songData);
        console.log(songData)
    }
    else{
        //If there is an error then log the error
        fs.appendFile(logFile, "\r\n"+ err)
    }
    });
}

//OMDB movie by title function
var movieMove = function() {
    //If there is no title put in then search this by default
    if (!title) {
        title = "Mr Nobody";
    }
    //Sets up the url to search by
    var urlHit = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    //Request function
    request(urlHit, function(err, res, body) {
        //If there is no error then perform search
        if (!err) {
            //Parses response from search and sets it to a variable
            var movieResponse = JSON.parse(body);
            var movieData = [
            //Logs out the necessary parts from the response variable
            'Movie Title: ' + movieResponse.Title,
            'Release Year: ' + movieResponse.Year,
            'Rotten Tomatoes Rating: ' + movieResponse.Ratings[1].Value,
            'IMDB Rating: ' + movieResponse.imdbRating,
            'Country produced in: ' + movieResponse.Country,
            'Language: ' + movieResponse.Language,
            'Plot: ' + movieResponse.Plot,
            'Actors: ' + movieResponse.Actors
            ]
            console.log(movieData)
            fs.appendFile(logFile, "\r\n"+ movieData)
        } 
        //If there is an error log it
        else {
            fs.appendFile(logFile, "\r\n"+ err)
             console.log(err);
        }
    });
}

//Do what is in the text file random.txt
function doWhatItSays() {
    //file system and lists the tet file to look in
    fs.readFile("random.txt", "utf8", function(err, data){
        //IF no error then do it
        if (!err) {
            doWhatItSays = data.split(",");
            spotifySong(doWhatItSays[1]);
        } 
        //If there is an error log it
        else {
            fs.appendFile(logFile, "\r\n"+ err)
            console.log(err);
        }
    });
};

// node liri.js my-tweets
// node liri.js spotify-this-song thriller
// node liri.js movie-this batman
// node liri.js do-what-it-says

if (command==="my-tweets"){
    twitterTweets();
}
else if(command==="spotify-this-song"){
    spotifySong();
}
else if(command==="movie-this"){
    movieMove();
}
else if(command==="do-what-it-says"){
    doWhatItSays();
}
else{
    console.log("Invalid Command");
}

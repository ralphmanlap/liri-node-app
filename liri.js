var dataKeys = require("./keys.js");
var fs = require('fs');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

//Commands to take in:
// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says

var command = process.argv[2];
var item = process.argv[3];

//Twitter function
function myTweets() {

  var client = new twitter(dataKeys.twitterKeys); //keys from keys.js

  var params = { screen_name: 'ralphmanlap', count: 20 }; //twitter handle and tweet limit to pass as parameters for get

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {

    	var tweetArr = [];
    	for (var i = 0; i < tweets.length; i++) {
        	tweetArr.push({ //Put into an array the tweets with the data of when it was created and the tweet
            	'created at: ' : tweets[i].created_at,
            	'Tweets: ' : tweets[i].text,
      		});
    	}
      console.log(tweetArr);
    }
  });
};

//Spotify function
function spotifyThis (song){
 //Default to The Sign if no song provided
  if (song === undefined) {
    song = 'The Sign';
  };

  spotify.search({ type: 'track', query: song }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    var songs = data.tracks.items; //songs retrieved from search
    var songArr = []; //empty array to hold data of songs

    for (var i = 0; i < songs.length; i++) {
      songArr.push({
        'artist/group': songs[i].artists.map(getArtists),
        'song title: ': songs[i].name,
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name,
      });
    }
    console.log(songArr);
  });
};

var getArtists = function(artist) {
  return artist.name;
};


//OMDB Movie function
function movie (movieTitle){

	if (movieTitle === undefined) {
    	movieTitle = 'Mr Nobody'; //Default to Mr.Nobody if no movie title was entered
  	}

  	var url = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=full&tomatoes=true&r=json";

  	request(url, function(error, response, body) {
	  if (!error && response.statusCode == 200) {

      	var movieArr = [];
      	var jsonData = JSON.parse(body);

      	movieArr.push({
      		'Title: ' : jsonData.Title,
      		'Year: ' : jsonData.Year,
      		'Rating: ' : jsonData.Rated,
      		'IMDB Rating: ' : jsonData.imdbRating,
      		'Country: ' : jsonData.Country,
      		'Language: ' : jsonData.Language,
      		'Plot: ' : jsonData.Plot,
      		'Actors/Actresses: ' : jsonData.Actors,
      		'Rotten Tomatoes: ' : jsonData.tomatoRating,
      		'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
  		});
      	console.log(movieArr);
	  }
	});
};


function doIt() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    var dataArr = data.split(',')
    console.log(dataArr);
    liri(dataArr[0], dataArr[1]);

  });
}


function liri (command, item){

if (command === "my-tweets"){
	myTweets();
}
else if(command === "spotify-this-song"){
	spotifyThis(item);
}
else if (command === "movie-this"){
	movie(item);
}
else if(command === "do-what-it-says"){
	doIt();
}
else{
	console.log("Command not recognized.");
}

};

liri(command,item);
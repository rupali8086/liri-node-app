require("dotenv").config

// require the keys.js file that holds the twitter keys
var twitterKeysObject = require('./keys.js');

// npm install twitter, npm install spotify, npm install request
var Twitter = require('twitter');
var Spotify = require('spotify');
var Request = require('request');

// require Node built in fs library package for filesystem access
var fs = require('fs');

// the data is received as an object, but original data was an object too
// so peel back one layer and get to the actual keys object
var twitterKeys = twitterKeysObject.twitterKeys;

var command = process.argv[2];
var commandArgument = process.argv[3];

switch(command) {

	// handle my tweet commands
	case 'my-tweets':
	myTweets();
	break;

	// handle the spotify-this-song command
	case 'spotify-this-song':
	mySpotify(commandArgument);
	break;

	// handle the movie-this command
	case 'movie-this':
	movieThis(commandArgument);
	break;

	// handle the do-what-it-says command
	case 'do-what-it-says':
	doWhatItSays();
	break;

	// default response when command is not valid
	default:
	 console.log("Error, Please try again");

}

// for my-tweets case
function myTweets() {

	// set up credential aobject for Twitter access
	var client = new Twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret
	});

	var params =   {	count:20,
					trim_user: false,
					exclude_replies: true,
					include_rts: false };

	// get the 20 most recent tweets, making sure to exclude replies and retweets
	client.get('statuses/user_timeline',params, function(error,tweets,responce){
		
		// if an error  caught, display error msg and exit out of the function
		if(error) return console.log("Error"  + error);

		// log the command issued to the log.txt file
		logCommand();

		// loop through the 20 returned tweets and log their time and content
		for(var i = 0 ; i < tweets.length ; i ++) {
			logThis("========================================");
			logThis(tweets[i].created_at);
			logThis(tweets[i].text);
			logThis("========================================");
		}
	});

}

// for  spotify-this-song case
function mySpotify(receivedSong) {
	// set up credential aobject for Twitter access
	// var spotify = new Spotify(keys.spotify);
	var mySong = receivedSong ? receivedSong : 'The Sign Ace of Base';
		// var Spotify = new Spotify({
		//   id: <your spotify client id>,
		//   secret: <your spotify client secret>
		// });


	Spotify.search({
			type: 'track', 
			query: mySong
		}, function(err,data){

		// if an error is caught in the call, display that and exit the function
		if(err) return console.log("Spotify error" + err);

		// if the song is not found in the Spotify database, log that and exit the function
		if(data.tracks.item.length == 0 ) return (console.log("No such song found!"));

		// log the command issued to the log.txt file
		logCommand();

		// multiple hits - basicaly go with the best match
		logThis("========================================");
		logThis("Artist Name  : "  + data.tracks.items[0].artist[0].name);
		logThis("Song Name  : " + data.tracks.items[0].name);
		logThis("Preview Link : " + data.tracks.items[0].preview_url);
		logThis("Album Title  : " + data.tracks.items[0].album.name);
		logThis("========================================");
	});
}

 // for  movie-this case
 function movieThis(receivedMovie) {

 	// first save the name of the movie if provided from command line
	// otherwise default to "Mr. Nobody"
	// use ternary function for ease of use

	var myMovie = receivedMovie ? receivedMovie : " Mr. Nobody" ;

	// Then run a request to the OMDB API with the movie specified
	Request("http://www.omdbapi.com/?t="  + myMovie + "&y=&plot=short&r=json&tomatoes=true", function(error,response,body){

			// If the request is successful (i.e. if the response status code is 200)
			if(!error && response.statusCode === 200 ) {
				// log the command issued to the log.txt file
				logCommand();

				// Parse the returned data (body) and display movie info
				logThis("========================================");
				logThis("Movie Title  : " + JSON.parse(body).Title);
				logThis("Release Year  : " + JSON.parse(body).Year);
				logThis(" IMDB Rating  : "  + JSON.parse(body).imdbRating);
				logThis("Rotten Tomatoes Rating of the movie  : "  + JSON.parse(body).tomatoRating);
				logThis("Production Country"  + JSON.parse(body).Country);
				logThis("Language  : " + JSON.parse(body).Language);
				logThis("Plot  : " + JSON.parse(body).Plot);
				logThis("Actors/Actresses:" + JSON.parse(body).Actor);
				logThis("========================================");
			}
	});
}

// for do-what-it-says case
function doWhatItSays() {
	// read in the random.txt file
	fs.readFile('random.txt', 'utf-8', function(error, data){

		// if an error is caught in the read, display that and exit the function
		if(error) return console.log("Filesystem Read Error  :" + error);

		// split data into an array of function name and argument
		var dataObject = data.split(',');

		// define the function name and argument name
		var myFunction = dataObject[0];
		var myArgument = dataObject[1];

		// modify the myFunction received into the function names used in this app
		switch(myFunction)  { 
			case 'my-tweets'  : 
			myFunction = 'myTweets';
			break;

			case 'spotify-this-song' :
			myFunction = "mySpotify";
			break;

			case "movie-this" :
			myFunction = "movieThis";
			break;

			default : 
			console.log("Unexpected error ");
		}

	 	eval(myFunction)(myArgument);
	});
}

// logging function
function logThis(dataToLog)  {

	// log the data to console
	console.log(dataToLog);

	// also append it to log.txt followed by new line escape
	fs.appendFile("log.txt" , dataToLog + "\n" , function(err){
		
		// if there is an error log that then end function
		if(err) return console.log("Error logging data to file  :"  + err);
	});
}

// logging command to log.txt file function
function logCommand() {

	// structure the string that equates to the command that was issued
	if(commandArgument) {

		var tempString = "COMMAND: node liri.js " + command + " '" + commandArgument + "'";
	} 
	else {
		var tempString = "COMMAND: node liri.js " + command;
	}

	// append the command to log.txt followed by new line escape
	fs.appendFile("log.txt" , tempString + "\n" , function(err){

		// if there is an error log that then end function
		if (err) return console.log('Error logging command to file: ' + err);

	});

}







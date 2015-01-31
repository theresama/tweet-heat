/**
 * Module dependencies.
 */
var express = require('express')
  , io = require('socket.io')
  , http = require('http')
  , twitter = require('ntwitter')
  , cronJob = require('cron').CronJob
  , _ = require('underscore')
  , path = require('path');

//Create an express app
var app = express();

//Create the HTTP server with the express app as an argument
var server = http.createServer(app);

//Credentials
var api_key = 'h5KqsbOHAuUU9UNCvqMIRBmbm';               // <---- Fill me in
var api_secret = 'eTyQqDKMt9yM8gpDmX3T16TFzkSmPrLqv6TczmefCLa8fn4CYM';            // <---- Fill me in
var access_token = '2707849772-yd2FL9C0mUNufGi2saevY5FE9eh8EbQRYJ13O7O';          // <---- Fill me in
var access_token_secret = 'atpFPurfZtUEfJjsa0wEudDVnqYiiQJ5F9LKFC38mEBGg';   // <---- Fill me in

// User inputted subject
var subject = 'Superbowl'
// Location-time array
var location_time = [];
// Indexer
var index = 0;

//Generic Express setup
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//We're using bower components so add it to the path to make things easier
app.use('/components', express.static(path.join(__dirname, 'components')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Our only route! Render it with the current watchList
app.get('/', function(req, res) {
	res.render('index', {subject : subject, data : location_time });
});

//Start a Socket.IO listen
var sockets = io.listen(server);

//Set the sockets.io configuration.
//THIS IS NECESSARY ONLY FOR HEROKU!
//sockets.set('transports', ['xhr-polling']);
//sockets.set('polling duration', 10);

//If the client just connected, give them fresh data!
sockets.sockets.on('connection', function(socket) { 
    socket.emit('data', location_time);
});

// Instantiate the twitter connection
var t = new twitter({
    consumer_key: api_key,
    consumer_secret: api_secret,
    access_token_key: access_token,
    access_token_secret: access_token_secret
});

// Tell the twitter API to filter on the user-inputted subject 
t.stream('statuses/filter', { track: subject }, function(stream) {

  //We have a connection. Now watch the 'data' event for incomming tweets.
  stream.on('data', function(tweet) {
    console.log(tweet.text);
    location_time[index] = tweet.text;
    index = (index + 1) % 10;
    sockets.sockets.emit('data', location_time);
  });
  	
});

//Reset everything on a new day!
//We don't want to keep data around from the previous day so reset everything.
new cronJob('0 0 0 * * *', function(){
    //Send the update to the clients
    sockets.sockets.emit('data', location_time);
}, null, true);

//Create the server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// ***** Create an Express + Socket.io app *****
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// ***** Connect with twit (Twitter API) *****
var Twit = require('twit');

twitterCreds = {
  consumer_key: 'CNyhZZho1PymnVISJOXlZ50wi',
  consumer_secret: 'lG4OFI4AI8vHJ51bQIqIrqPiTJRMGL18p7S6n007sUVtAGMOCl',
  access_token: '1646397260-hw1D3OrJGw9whZKDnqu1QZXpcLExA1Wr7N7kx73',
  access_token_secret: 'a71A2i4yZmrGnLE7fJyzCc6FWeL8mx5rMC2sP51AgB0h0'
};

var T = new Twit(twitterCreds);
var stream = T.stream('statuses/sample');

// ***** Render index page  *****
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// *** Set default subject to UofTHacks ***
var subject = "UofTHacks";

// *** Pass data between server and client ***
// Listen on the server side for a change in subject
// One subject chosen, send tweets to client

io.on('connection', function(socket) {
  socket.on('new subject', function(text) {
    subject = text;
    stream.stop();
    stream = T.stream('statuses/filter', {track: text});
    
    stream.on('tweet', function (tweet) {
      console.log(text + " : " + tweet.text);
      io.sockets.emit('new tweet', tweet.coordinates);
    }); 

    stream.on('error', function(error) {
      console.log(error);
    });
      
   });
});

// ****** Attempt to focus in on one area ******

// client.stream('statuses/filter', {track: text}, function(stream) {
//   stream.on('data', function(tweet) {
//     console.log(tweet.coordinates);
//     io.sockets.emit('new tweet', tweet.coordinates);
//   });

//   stream.on('error', function(error) {
//     console.log(error);
//   });
// });

//***********************************************

// Listen on port 8080
http.listen(8080, function(){
  console.log('listening on *:8080');
});

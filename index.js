var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');


// Set up Twitter
var Twit = require('twit');

twitterCreds = {
  consumer_key: 'CNyhZZho1PymnVISJOXlZ50wi',
  consumer_secret: 'lG4OFI4AI8vHJ51bQIqIrqPiTJRMGL18p7S6n007sUVtAGMOCl',
  access_token: '1646397260-hw1D3OrJGw9whZKDnqu1QZXpcLExA1Wr7N7kx73',
  access_token_secret: 'a71A2i4yZmrGnLE7fJyzCc6FWeL8mx5rMC2sP51AgB0h0'
};

var T = new Twit(twitterCreds);
var stream = T.stream('statuses/sample');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var subject = "UofTHacks";

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



// client.stream('statuses/filter', {track: text}, function(stream) {
//   stream.on('data', function(tweet) {
//     console.log(tweet.coordinates);
//     io.sockets.emit('new tweet', tweet.coordinates);
//   });

//   stream.on('error', function(error) {
//     console.log(error);
//   });
// });


//***************

http.listen(8080, function(){
  console.log('listening on *:8080');
});

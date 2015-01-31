var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');


// Set up Twitter
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'h5KqsbOHAuUU9UNCvqMIRBmbm',
  consumer_secret: 'eTyQqDKMt9yM8gpDmX3T16TFzkSmPrLqv6TczmefCLa8fn4CYM',
  access_token_key: '2707849772-yd2FL9C0mUNufGi2saevY5FE9eh8EbQRYJ13O7O',
  access_token_secret: 'atpFPurfZtUEfJjsa0wEudDVnqYiiQJ5F9LKFC38mEBGg'
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});



client.stream('statuses/filter', {track: 'Superbowl'}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
    io.sockets.emit('new tweet', tweet.text);
    //io.on('connection', function(socket){
    //socket.on('new tweet', function(text){
    //  io.emit('new tweet', tweet.text);
    //});
    //});
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});


http.listen(8080, function(){
  console.log('listening on *:8080');
});

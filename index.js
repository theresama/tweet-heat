var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');


// Set up Twitter
var Twit = require('twit');

twitterCreds = {
  consumer_key: '9tJIrpsuuNGRYlGMpdBmfviau',
  consumer_secret: '4yWuUdJmhWTU0tPKcTI9DgbLSb2WMtfOKkzuXff2YI62UNLBgh',
  access_token: '1646397260-TXHpIMv1IKDAJ4auiCHHCbDsJaYa33Q8mKIHN14',
  access_token_secret: 'mL2XkXjqiWgvqFuhWeNmcX7Q3uqijKPhzI4LhaCQiF4U7'
};

var T = new Twit(twitterCreds);
var stream = T.stream('statuses/sample');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var text = "Superbowl";
//var ne = ;
//var sw = ;
//  ********

io.on('connection', function(socket) {
  socket.on('new subject', function(text) {
    stream.stop();
    stream = T.stream('statuses/filter', {track: text})
    stream.on('tweet', function (tweet) {
      console.log(text + " : " + tweet.text);
      io.sockets.emit('new tweet', tweet.coordinates);
    }); 

    stream.on('error', function(error) {
     console.log(error);
    });
      
   });

  socket.on('close stream', function(text) {
    console.log("close");
    //T.stream.stop()
  });

  socket.on('new boundary', function(newNe, newSw) {
    
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

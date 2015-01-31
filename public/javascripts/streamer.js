$(function() { 
    t.stream('statuses/filter', {track: 'Superbowl'}, function(stream) {
        stream.on('data', function(tweet) {
            console.log(tweet.text);
        });
    });
})

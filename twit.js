var Twit = require('twit')

var T = new Twit({
    consumer_key: '9tJIrpsuuNGRYlGMpdBmfviau',
    consumer_secret: '4yWuUdJmhWTU0tPKcTI9DgbLSb2WMtfOKkzuXff2YI62UNLBgh',
    access_token_key: '1646397260-TXHpIMv1IKDAJ4auiCHHCbDsJaYa33Q8mKIHN14',
    access_token_secret: 'mL2XkXjqiWgvqFuhWeNmcX7Q3uqijKPhzI4LhaCQiF4U7'
})


//
//  filter the twitter public stream by the word 'superbowl'.
//
var stream = T.stream('statuses/filter', { track: 'superbowl' })

stream.on('tweet', function (tweet) {
  console.log(tweet)
})

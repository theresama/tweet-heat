#tweet-heat

A Google Heatmap visualization of topic tweets from the Twitter live stream.
[see here](http://www.tweetheat.me)

####Setup
```
git clone https://github.com/theresama/tweet-heat.git
npm install
```
open up index.js and enter your Twitter app authorization tokens into:
```
var T = new Twit({
    consumer_key:         '...'
  , consumer_secret:      '...'
  , access_token:         '...'
  , access_token_secret:  '...'
})
```
###Run
```
node index.js
view http://localhost:8080
```


Made @ U of T hacks 2015 by [Celton McGrath](//github.com/celtonmcgrath) & Theresa Ma
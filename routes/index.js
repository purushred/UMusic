var express = require('express');
var router = express.Router();
var youtubeStream = require('youtube-audio-stream')
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.send("Hello World!!");

  var getAudio = function(req, res) {
 
  var requestUrl = 'http://youtube.com/watch?v=-IPKPz1pujM' ;//+ req.params.videoId;
 
  try {
  	console.log("Before Download");
    youtubeStream(requestUrl).pipe(res);
    console.log("After Download");
  } catch(exception) {
    res.status(500).send(exception);
  }
 
};
getAudio();
});

module.exports = router;

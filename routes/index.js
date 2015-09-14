var express = require('express');
var router = express.Router();
var youtubedl = require('youtube-dl');
router.get('/', function(req, res, next) {

var url = 'https://www.youtube.com/watch?v=iE8yHtmEYjM';
youtubedl.getInfo(url, function(err, info) {
  if (err) throw err;
 
  console.log('id:', info.id);
  console.log('title:', info.title);
  console.log('url:', info.url);
  console.log('filename:', info._filename);
  console.log('format id:', info.format_id);
  res.send("Album Title: "+info.title);  
});
  
});

module.exports = router;

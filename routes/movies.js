var express = require('express');
var router = express.Router();
var youtube = require('./youtube');

router.get('/movies', function(req, res, next) {
  var url = req.query.youtubeUrl;
  if(url){
    console.log("Movie processed:",url);
    res.send("Movie processed successfully"+url);
    return;
  }
  var movies = new Array();
  /*movies.push({title:'Magadheera',youtubeUrl:'https://www.youtube.com/watch?v=ZW_lhpI7aEc'});
  movies.push({title:'Ega',youtubeUrl:'https://www.youtube.com/watch?v=IV9cnQF8ZAE'});
  movies.push({title:'Maryada Ramanna',youtubeUrl:'https://www.youtube.com/watch?v=z9Uvi93fmJ0'});
  movies.push({title:'Bahubali',youtubeUrl:'https://www.youtube.com/watch?v=s7sSjAwORp0'});*/

  res.send(movies);
  
}).post('/movies', function(req, res, next) {

    youtube.handleRequest(req,res);
    //res.send(req.body);
    console.log("Posted movies",req.body);
});

module.exports = router;

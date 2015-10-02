var express = require('express');
var fs = require('fs');
var youtubedl = require('youtube-dl');
var fluentFfmpeg = require('fluent-ffmpeg');
var exec = require('child_process').exec;
var urlModule = require('url');
var parseString = require('xml2js').parseString;
var https = require('https');

function xmlToJson(url, callback) {
  var req = https.get(url, function(res) {
    var xml = '';
    
    res.on('data', function(chunk) {
      xml += chunk;
    });

    res.on('error', function(e) {
      callback(e, null);
    }); 

    res.on('timeout', function(e) {
      callback(e, null);
    }); 

    res.on('end', function() {
      callback(null, xml);
    });
  });
}

function sortNumber(a,b) {
    return a - b;
}

function getTimeArray(err, data) {
  if (err) {
    return console.err(err);
  }
  var xpath = require('xpath');
  var dom = require('xmldom').DOMParser;
 
    var doc = new dom().parseFromString(data);
    var nodes = xpath.select("/document/annotations/annotation/action/url[@target=\'current\']", doc);
    var timeArray = new Array();
    for(var i=0;i<nodes.length;i++){
      var urlStr = nodes[i].attributes['1'].nodeValue;
      var hash = urlModule.parse(urlStr).hash;
      if(hash){
        hash=hash.substring(3,hash.length-1);
        hash=hash.replace("m",":");
        var a = hash.split(':');
        var seconds=0;
        if(a.length>2){
          seconds = ((+a[0]) * 60 * 60) + ((+a[1]) * 60)+ (+a[2]);   
        }
        else {
          seconds = ((+a[0]) * 60)+ (+a[1]);
        }
        timeArray.push(seconds);
      }
      else {
        timeArray.push(0);
      }
    }
    console.log(timeArray.sort(sortNumber));
}

var annotationUrl = "https://www.youtube.com/annotations_invideo?video_id=Z0-yDaWOX7I";
var outputFile = "/root/node_workspace/umusic/audio/";

exports.handleRequest = function(req,res) {
  xmlToJson(annotationUrl, getTimeArray);

  /*
    var movie = req.body;
    var url = movie.youtubeUrl;
    var ytdl = youtubedl(url,['-f','bestaudio','--extract-audio']);
    youtubedl.getInfo(url, function(err, info) {
    if (err) throw err;

    outputFile += movie.title+".mp3";
    console.log('thumbnail:', info.thumbnail);
    console.log("Movie Quality:",movie.quality);
    var youtubeId = info.id;
    var ffmpeg = new fluentFfmpeg({source:ytdl})
    ffmpeg.withAudioCodec('libmp3lame')
     .audioQuality(movie.quality)
     .toFormat('mp3')
     .on('start', function(cmd) {
        console.log("Mp3 file conversion started");
     })
     .on('error', function(err) {
       console.log('An error occurred: ' + err.message);
       res.send("Failed to save file : "+err);
     })
     .on('end', function() {

      var songs = movie.songs;
      var noOfSongs = songs.length;
      var dir  = "audio/"+movie.title;
      if(!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
      }
      for(var i=0;i<noOfSongs;i++)
      {
	var startTime = songs[i].startTime;
	var splitFileCmd;
	if(i==noOfSongs-1)
	{
     	  splitFileCmd = "ffmpeg -ss "+startTime+" -i "+outputFile+" -i "+info.thumbnail.replace("https","http")+" -acodec copy -map 0 -map 1 -metadata title=\'"+songs[i].song+"\' -metadata album=\'"+movie.title+"\' -metadata album_artist=\'"+songs[i].singer+"\' -metadata composer=\'"+movie.musicDirector+"\' \'"+dir+"/"+songs[i].song+".mp3\'";
	}
	else {
	  var nextStartTime = songs[i+1].startTime;
          splitFileCmd = "ffmpeg -ss "+startTime+" -i "+outputFile+" -i "+info.thumbnail.replace("https","http")+" -t "+nextStartTime+" -acodec copy -map 0 -map 1 -metadata title=\'"+songs[i].song+"\' -metadata album=\'"+movie.title+"\' -metadata album_artist=\'"+songs[i].singer+"\' -metadata composer=\'"+movie.musicDirector+"\' \'"+dir+"/"+songs[i].song+".mp3\'";
	}
        console.log(splitFileCmd);
        exec(splitFileCmd, function(error, stdout, stderr){});
      }
 
	fs.unlink(outputFile,function(err){
	   if(err) console.log("Failed to delete file.");
	   console.log("File deleted successfully.");
	});
      res.send("Album Created Successfully");

    }).saveToFile(outputFile); // on end method
  }); */ // end of youtubedl.getInfo method
}


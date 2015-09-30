var express = require('express');
var fs = require('fs');
var youtubedl = require('youtube-dl');
var fluentFfmpeg = require('fluent-ffmpeg');
var exec = require('child_process').exec;
var urlModule = require('url');

var outputFile = "/root/node_workspace/umusic/audio/";

exports.handleRequest = function(req,res) {
  var movie = req.body;
  var url = movie.songs[0].youtubeUrl;
  var ytdl = youtubedl(url,['-f','bestaudio','--extract-audio']);

  youtubedl.getInfo(url, function(err, info) {
    if (err) throw err;
    outputFile += info.title.split(' ')[0]+".mp3";
    console.log('thumbnail:', info.thumbnail);

    var ffmpeg = new fluentFfmpeg({source:ytdl})
    ffmpeg.withAudioCodec('libmp3lame')
     .audioQuality(2)
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
        var query = urlModule.parse(songs[i].youtubeUrl,true).query;
	var startTime = query.t;
	var splitFileCmd;
	if(i==noOfSongs-1)
	{
     	  splitFileCmd = "ffmpeg -ss "+startTime+" -i "+outputFile+" -i "+info.thumbnail.replace("https","http")+" -acodec copy -map 0 -map 1 -metadata title=\'"+songs[i].song+"\' -metadata album=\'"+movie.title+"\' -metadata album_artist=\'"+songs[i].singer+"\' -metadata composer=\'"+movie.musicDirector+"\' \'"+dir+"/"+songs[i].song+".mp3\'";
	}
	else {
          var nextQuery = urlModule.parse(songs[i+1].youtubeUrl,true).query;
	  var nextStartTime = nextQuery.t;
	  var diff = Number(nextStartTime)-Number(startTime);
          splitFileCmd = "ffmpeg -ss "+startTime+" -i "+outputFile+" -i "+info.thumbnail.replace("https","http")+" -t "+diff+" -acodec copy -map 0 -map 1 -metadata title=\'"+songs[i].song+"\' -metadata album=\'"+movie.title+"\' -metadata album_artist=\'"+songs[i].singer+"\' -metadata composer=\'"+movie.musicDirector+"\' \'"+dir+"/"+songs[i].song+".mp3\'";
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
  }); // end of youtubedl.getInfo method
}


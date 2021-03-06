var express = require('express');
var router = express.Router();
var fs = require('fs');
var youtubedl = require('youtube-dl');
var fluentFfmpeg = require('fluent-ffmpeg');
var exec = require('child_process').exec;

router.get('/', function(req, res, next) {
  //var url = req.query.url;
  var url = 'https://www.youtube.com/watch?v=s7sSjAwORp0'; 
  var outputFile = "/root/node_workspace/umusic/audio/";
  var ytdl = youtubedl(url,['-f','bestaudio','--extract-audio']);

  res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
  youtubedl.getInfo(url, function(err, info) {
    if (err) throw err;
    outputFile += info.title.split(' ')[0]+".mp3";
    console.log('title:', info.title);
    console.log('thumbnail:', info.thumbnail);
    console.log('filename:', info._filename);
    var ffmpeg = new fluentFfmpeg({source:ytdl})
 //   .audioBitrate('192k')
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
  console.log('Processing finished !');
  exec("ffmpeg -i "+outputFile+" -af silencedetect=n=-25dB:d=1 -f null -",function(error,stdout,stderr){
   var lines = stderr.toString().split('\n');
   var previousStartTime="0";
   var trackNo=0;
   lines.forEach(function(line) {
    if(line.indexOf("silence_start")>-1)
    {
     trackNo++;
     var startTime = line.split(": ")[1];
     var diff = Number(startTime)-Number(previousStartTime);
     var splitFileCmd = "ffmpeg -ss "+previousStartTime+" -i "+outputFile+" -t "+diff+" -acodec copy track-"+trackNo+".mp3";
     previousStartTime = startTime;
     console.log(splitFileCmd);
     exec(splitFileCmd, function(error, stdout, stderr){});
   }
    	});// for each loop
   res.send("Album Created Successfully");
      }); // exe method
    //}).pipe(res); // on end method == Uncomment here to stream
    }).saveToFile(outputFile); // on end method
});
}); // router.get method end

module.exports = router;

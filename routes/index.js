var express = require('express');
var router = express.Router();
var youtubedl = require('youtube-dl');
var fluentFfmpeg = require('fluent-ffmpeg');
var exec = require('child_process').exec;

router.get('/', function(req, res, next) {
var url = 'https://www.youtube.com/watch?v=iE8yHtmEYjM';
var outputDir = "/root/node_workspace/umusic/audio/audio1.mp3";
var ytdl = youtubedl(url,['-f','bestaudio','--extract-audio']);
var ffmpeg = new fluentFfmpeg({source:ytdl})
ffmpeg.withAudioCodec('libmp3lame')
    .audioBitrate('192k')
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
	function execute(command, callback){
	    exec(command, function(error, stdout, stderr){ callback(error,stdout,stderr); });
	};
	execute("ffmpeg -i "+outputDir+" -af silencedetect=n=-20dB:d=1 -f null -",function(error,stdout,stderr){
	var lines = stderr.toString().split('\n');
	var previousStartTime="0";
	var trackNo=0;
    	lines.forEach(function(line) {
		if(line.indexOf("silence_start")>-1)
		{
			trackNo++;
			var startTime = line.split(": ")[1];
			var diff = Number(startTime)-Number(previousStartTime);
			var cmd = "ffmpeg -ss "+previousStartTime+" -i "+outputDir+" -t "+diff+" -acodec copy track-"+trackNo+".mp3";
			previousStartTime = startTime;
			console.log(cmd);
		        exec(cmd, function(error, stdout, stderr){});
		}
    	});
});
    })
}); // router.get method end

module.exports = router;


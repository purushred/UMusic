var express = require('express');
var router = express.Router();
var youtubedl = require('youtube-dl');
var fluentFfmpeg = require('fluent-ffmpeg');
var exec = require('child_process').exec;

router.get('/', function(req, res, next) {
  //var url = req.query.url;
//  var url ='https://www.youtube.com/watch?v=s7sSjAwORp0';
var url = 'https://www.youtube.com/watch?v=H7HmzwI67ec';
var outputFile = "/root/node_workspace/umusic/audio/";
var ytdl = youtubedl(url,['-x', '--audio-format', 'mp3','--audio-quality','2']);//['-f','bestaudio','--extract-audio']);
ytdl.on('info', function(info) {
  console.log('Got video info',info);
res.writeHead(200, {
        'Content-Type': 'audio/mpeg'
    });
  ytdl.pipe(res);
});


/*var url = 'https://www.youtube.com/watch?v=H7HmzwI67ec';
//  youtube-dl --extract-audio --audio-format mp3  --audio-quality 2 'https://www^Coutube.com/watch?v=s7sSjAwORp0'
youtubedl.exec(url, ['-x', '--audio-format', 'mp3','--audio-quality','2'], {}, function(err, output) {
  if (err) throw err;
  console.log("OutPUT:",output.join('\n'));
res.writeHead(200, {
        'Content-Type': 'audio/mpeg'
    });
  youtubedl.pipe(res);
  res.send("File Download completed");
});*/

/*youtubedl.getInfo(url, function(err, info) {
  if (err) throw err;
  outputFile += info.title.split(' ')[0]+".mp3";
  console.log('title:', info.title);
  console.log('thumbnail:', info.thumbnail);
  console.log('filename:', info._filename);
}); // youtubedl.getInfo method end
*/
}); // router.get method end

module.exports = router;

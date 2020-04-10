const AudioOutput = require('omxplayer-node');
const VideoOutput = require('omxplayer-node');
const createVideoPlayer = require('omxplayer-node');
const youtubedl = require('youtube-dl');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
require('dotenv').config();

// Create an instance of the player with some global params set
const videoPlayer = createVideoPlayer({
    display: VideoOutput.LCD,
    audio: AudioOutput.both,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.post('/yt', (req, res) => {
    const url = req.body.url;

    const options = [];

    youtubedl.getInfo(url, options, function (err, info) {
        if (err) throw err
        console.log('Youtube cast Url :', info.url)
        //launch omxplayer with this url

        // Open a file and set s'more params (these take precedency over the global ones)
        videoPlayer.open({
            source: url,
            audio: AudioOutput.HDMI,
            osd: true
        });

        // Control video/audio playback.
        player.pause();
        player.volUp();
        player.quit();

        res.json({
            status: 1,
            message: 'Casting your video with url : ' + url
        });
    })
});

//register our routes, all of our routes will be prefixed with /api
app.use('/activcast', router);

app.listen(port);
console.log('Started activCast on port ' + port);
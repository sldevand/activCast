var fs = require('fs');
var AudioOutput = require('omxplayer-node');
var VideoOutput = require('omxplayer-node');
var createVideoPlayer = require('omxplayer-node');
var youtubedl = require('youtube-dl');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
require('dotenv').config();

// Create an instance of the player with some global params set
const videoPlayer = createVideoPlayer({
    display: VideoOutput.HDMI,
    audio: AudioOutput.HDMI,
    osd: false
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.post('/yt', (req, res) => {
    const url = req.body.url;
    const options = [];
    youtubedl.getInfo(url, options, (err, info) => {
        if (err) throw err
        console.log('Youtubedl fetched stream Url');

        videoPlayer.open({
            source: info.url,
        });

        res.json({
            status: 1,
            message: 'Casting your video with url : ' + url
        });
    })
});

router.get('/pause', (req, res) => {
    videoPlayer.pause();
});

router.get('/play', (req, res) => {
    videoPlayer.play();
});

//register our routes, all of our routes will be prefixed with /api
app.use('/activcast', router);

app.listen(port);
console.log('Started activCast on port ' + port);

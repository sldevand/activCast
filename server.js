var fs = require('fs');
var AudioOutput = require('omxplayer-node');
var VideoOutput = require('omxplayer-node');
var createVideoPlayer = require('omxplayer-node');
var youtubedl = require('youtube-dl');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
require('dotenv').config();

const videoPlayer = createVideoPlayer({
    display: VideoOutput.HDMI,
    audio: AudioOutput.HDMI,
    osd: false
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/yt/:url', (req, res) => {
    const url = req.params.url;
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
    checkRunningPlayer();
    videoPlayer.pause();
    sendSuccess('Pause');
});

router.get('/play', (req, res) => {
    checkRunningPlayer();
    videoPlayer.play();
    sendSuccess('Play');
});

router.get('/stop', (req, res) => {
    checkRunningPlayer();
    videoPlayer.quit();
    sendSuccess('Stop');
});

router.get('/fastFwd', (req, res) => {
    checkRunningPlayer();
    videoPlayer.fastFwd();
    sendSuccess('Fast Forward');
});

router.get('/fwd30', (req, res) => {
    checkRunningPlayer();
    videoPlayer.fwd30();
    sendSuccess('Skip forward by 30 sec');
});

router.get('/fwd600', (req, res) => {
    checkRunningPlayer();
    videoPlayer.fwd600();
    sendSuccess('Skip forward by 10 minutes');
});

router.get('/rewind', (req, res) => {
    checkRunningPlayer();
    videoPlayer.rewind();
    sendSuccess('Rewind');
});

router.get('/back30', (req, res) => {
    checkRunningPlayer();
    videoPlayer.back30();
    sendSuccess('Skip backward by 30 sec');
});

router.get('/back600', (req, res) => {
    checkRunningPlayer();
    videoPlayer.back600();
    sendSuccess('Skip backward by 10 minutes');
});

router.get('/subtitles', (req, res) => {
    checkRunningPlayer();
    videoPlayer.subtitles();
    sendSuccess('Toggle subtitles');
});

router.get('/info', (req, res) => {
    checkRunningPlayer();
    videoPlayer.info();
    sendSuccess('Show infos of the file');
});

router.get('/incSpeed', (req, res) => {
    checkRunningPlayer();
    videoPlayer.incSpeed();
    sendSuccess('Increase speed');
});

router.get('/decSpeed', (req, res) => {
    checkRunningPlayer();
    videoPlayer.decSpeed();
    sendSuccess('Decrease speed');
});

router.get('/prevChapter', (req, res) => {
    checkRunningPlayer();
    videoPlayer.prevChapter();
    sendSuccess('Previous chapter');
});

router.get('/nextChapter', (req, res) => {
    checkRunningPlayer();
    videoPlayer.nextChapter();
    sendSuccess('Next chapter');
});

router.get('/prevAudio', (req, res) => {
    checkRunningPlayer();
    videoPlayer.prevAudio();
    sendSuccess('Previous audio');
});

router.get('/nextAudio', (req, res) => {
    checkRunningPlayer();
    videoPlayer.nextAudio();
    sendSuccess('Next audio');
});

router.get('/prevSubtitle', (req, res) => {
    checkRunningPlayer();
    videoPlayer.prevSubtitle();
    sendSuccess('Previous subtitle');
});

router.get('/nextSubtitle', (req, res) => {
    checkRunningPlayer();
    videoPlayer.nextSubtitle();
    sendSuccess('Next subtitle');
});

router.get('/incSubDelay', (req, res) => {
    checkRunningPlayer();
    videoPlayer.incSubDelay();
    sendSuccess('Increase subtitle delay');
});

router.get('/isRunning', (req, res) => {
    checkRunningPlayer();
    videoPlayer.nextAudio();
    let message = videoPlayer.isRunning
        ? 'Player is running'
        : 'Player is not running'

    sendSuccess(message);
});


//register our routes, all of our routes will be prefixed with /api
app.use('/activcast', router);

app.listen(port);
console.log('Started activCast on port ' + port);


function checkRunningPlayer() {
    if (!videoPlayer.running) {
        return res.json({
            status: 0,
            message: 'Player is not running',
            running: videoPlayer.running
        })
    }
}

function sendSuccess(message) {
    return res.json({
        status: 1,
        message: message,
        running: videoPlayer.running
    });
}
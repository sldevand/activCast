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

        sendSuccess(res, 'Casting your video : ' + url);
    })
});

router.get('/pause', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.pause();
    sendSuccess(res, 'Pause');
});

router.get('/play', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.play();
    sendSuccess(res, 'Play');
});

router.get('/stop', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.quit();
    sendSuccess(res, res, 'Stop');
});

router.get('/fastFwd', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.fastFwd();
    sendSuccess(res, 'Fast Forward');
});

router.get('/fwd30', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.fwd30();
    sendSuccess(res, 'Skip forward by 30 sec');
});

router.get('/fwd600', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.fwd600();
    sendSuccess(res, 'Skip forward by 10 minutes');
});

router.get('/rewind', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.rewind();
    sendSuccess(res, 'Rewind');
});

router.get('/back30', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.back30();
    sendSuccess(res, 'Skip backward by 30 sec');
});

router.get('/back600', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.back600();
    sendSuccess(res, 'Skip backward by 10 minutes');
});

router.get('/subtitles', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.subtitles();
    sendSuccess(res, 'Toggle subtitles');
});

router.get('/info', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.info();
    sendSuccess(res, 'Show infos of the file');
});

router.get('/incSpeed', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.incSpeed();
    sendSuccess(res, 'Increase speed');
});

router.get('/decSpeed', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.decSpeed();
    sendSuccess(res, 'Decrease speed');
});

router.get('/prevChapter', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.prevChapter();
    sendSuccess(res, 'Previous chapter');
});

router.get('/nextChapter', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.nextChapter();
    sendSuccess(res, 'Next chapter');
});

router.get('/prevAudio', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.prevAudio();
    sendSuccess(res, 'Previous audio');
});

router.get('/nextAudio', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.nextAudio();
    sendSuccess(res, 'Next audio');
});

router.get('/prevSubtitle', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.prevSubtitle();
    sendSuccess(res, 'Previous subtitle');
});

router.get('/nextSubtitle', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.nextSubtitle();
    sendSuccess(res, 'Next subtitle');
});

router.get('/incSubDelay', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.incSubDelay();
    sendSuccess(res, 'Increase subtitle delay');
});

router.get('/isRunning', (req, res) => {
    checkRunningPlayer(res);
    videoPlayer.nextAudio();
    let message = videoPlayer.isRunning
        ? 'Player is running'
        : 'Player is not running'

    sendSuccess(res, message);
});

//register our routes, all of our routes will be prefixed with /api
app.use('/activcast', router);

app.listen(port);
console.log('Started activCast on port ' + port);


function checkRunningPlayer(res) {
    if (!videoPlayer.running) {
        return res.json({
            status: 0,
            message: 'Player is not running',
            running: videoPlayer.running
        })
    }
}

function sendSuccess(res, message) {
    return res.json({
        status: 1,
        message: message,
        running: videoPlayer.running
    });
}
var youtubedl = require('youtube-dl');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
require('dotenv').config();
var Omx = require('node-omxplayer');

var videoPlayer = Omx();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

// Middleware to test if player is running
router.use(function (req, res, next) {
    let pattern = /yt/;

    if (!pattern.test(req.path)) {
        if (videoPlayer.running) {
            return next();
        }
        return sendNotRunningPlayer(res);
    }

    return next();
})

router.post('/yt', (req, res) => {
    const url = req.body.url;
    const youtubeUrlPattern = /https:\/\/youtu.be\//

    if (!youtubeUrlPattern.test(url)) {
        return sendError(res, 'This url does not match any youtube share link!')
    }

    const options = [];
    youtubedl.getInfo(url, options, (err, info) => {
        if (err) {
            sendError(res, err.message);
        }
        console.log('Youtubedl fetched stream Url');
        console.log(info.url);
        if (videoPlayer.running) {
            return sendError(res, 'A player is already running !')
        }

        videoPlayer.newSource(info.url, "hdmi", false, 0);

        sendSuccess(res, 'Casting your video : ' + url);
    })
});

router.get('/command/pause', (req, res) => {
    videoPlayer.pause();
    sendSuccess(res, 'Pause');
});

router.get('/command/play', (req, res) => {
    videoPlayer.play();
    sendSuccess(res, 'Play');
});

router.get('/command/stop', (req, res) => {
    videoPlayer.quit();
    sendSuccess(res, 'Stop');
});

router.get('/command/volUp', (req, res) => {
    videoPlayer.volUp();
    sendSuccess(res, 'Volume Up');
});

router.get('/command/volDown', (req, res) => {
    videoPlayer.volDown();
    sendSuccess(res, 'Volume Down');
});


router.get('/command/fastFwd', (req, res) => {
    videoPlayer.fastFwd();
    sendSuccess(res, 'Fast Forward');
});

router.get('/command/fwd30', (req, res) => {
    videoPlayer.fwd30();
    sendSuccess(res, 'Skip forward by 30 sec');
});

router.get('/command/fwd600', (req, res) => {
    videoPlayer.fwd600();
    sendSuccess(res, 'Skip forward by 10 minutes');
});

router.get('/command/rewind', (req, res) => {
    videoPlayer.rewind();
    sendSuccess(res, 'Rewind');
});

router.get('/command/back30', (req, res) => {
    videoPlayer.back30();
    sendSuccess(res, 'Skip backward by 30 sec');
});

router.get('/command/back600', (req, res) => {
    videoPlayer.back600();
    sendSuccess(res, 'Skip backward by 10 minutes');
});

router.get('/command/subtitles', (req, res) => {
    videoPlayer.subtitles();
    sendSuccess(res, 'Toggle subtitles');
});

router.get('/command/info', (req, res) => {
    videoPlayer.info();
    sendSuccess(res, 'Show infos of the file');
});

router.get('/command/incSpeed', (req, res) => {
    videoPlayer.incSpeed();
    sendSuccess(res, 'Increase speed');
});

router.get('/command/decSpeed', (req, res) => {
    videoPlayer.decSpeed();
    sendSuccess(res, 'Decrease speed');
});

router.get('/command/prevChapter', (req, res) => {
    videoPlayer.prevChapter();
    sendSuccess(res, 'Previous chapter');
});

router.get('/command/nextChapter', (req, res) => {
    videoPlayer.nextChapter();
    sendSuccess(res, 'Next chapter');
});

router.get('/command/prevAudio', (req, res) => {
    videoPlayer.prevAudio();
    sendSuccess(res, 'Previous audio');
});

router.get('/command/nextAudio', (req, res) => {
    videoPlayer.nextAudio();
    sendSuccess(res, 'Next audio');
});

router.get('/command/prevSubtitle', (req, res) => {
    videoPlayer.prevSubtitle();
    sendSuccess(res, 'Previous subtitle');
});

router.get('/command/nextSubtitle', (req, res) => {
    videoPlayer.nextSubtitle();
    sendSuccess(res, 'Next subtitle');
});

router.get('/command/incSubDelay', (req, res) => {
    videoPlayer.incSubDelay();
    sendSuccess(res, 'Increase subtitle delay');
});

router.get('/command/isRunning', (req, res) => {
    videoPlayer.nextAudio();
    let message = videoPlayer.isRunning
        ? 'Player is running'
        : 'Player is not running'

    sendSuccess(res, message);
});

// router.use(/command/, (req, res, next) => {
//     console.log("command middleware")
//     if (videoPlayer.running) {
//         return next();
//     }
//     return sendNotRunningPlayer(res);
// });

//register our routes, all of our routes will be prefixed with /api
app.use('/activcast', router);

app.listen(port);
console.log('Started activCast on port ' + port);

function sendNotRunningPlayer(res) {
    sendError(res, 'Player is not running');
}

function sendError(res, message) {
    return res.json({
        status: 0,
        message: message,
        running: videoPlayer.running
    })
}

function sendSuccess(res, message) {
    return res.json({
        status: 1,
        message: message,
        running: videoPlayer.running
    });
}
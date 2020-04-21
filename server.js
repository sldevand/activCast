var youtubedl = require('youtube-dl');
var Omx = require('node-omxplayer');
var server = require('http').createServer();
var io = require('socket.io').listen(server);
require('dotenv').config({ path: __dirname + '/.env' });

var videoPlayer = Omx();
var port = process.env.PORT || 8080;
var debug = process.env.DEBUG || 0;

io.sockets.on('connection', socket => {
    var clientIp = socket.request.connection.remoteAddress;
    console.log("Client connected : " + clientIp);

    videoPlayer.on('error', (err) => {
        emitError(socket, err);
    });

    videoPlayer.on('close', (message) => {
        let msg = message || 'Player has closed';
        emitError(socket, msg);
    });

    socket.on('disconnect', () => {
        var clientIp = socket.request.connection.remoteAddress;
        if (videoPlayer.isRunning) videoPlayer.quit();
        console.log(clientIp + ' Disconnected');
    }).on('yt', (request) => {
        console.log(request);
        const json = JSON.parse(request);
        if (!checkUrlRequest(json)) {
            return;
        }

        launchYoutubeDl(socket, json.url);
    }).on('omx', (request) => {
        const json = JSON.parse(request);
        if (!checkUrlRequest(json)) {
            return;
        }
        console.log(json);
        if (debug == 0) {
            return launchOmxplayer(socket, json.url);
        }
        emitSuccess(socket, 'Fake omxplayer launch for debug');
    }).on('pause', () => {
        if (checkIsrunning(socket)) {
            videoPlayer.pause();
        }
    }).on('play', () => {
        if (checkIsrunning(socket)) {
            videoPlayer.play();
        }
    }).on('stop', () => {
        if (checkIsrunning(socket)) {
            videoPlayer.quit();
        }
    });
});

function checkIsrunning(socket) {
    if (!videoPlayer.running) {
        return emitError(socket, "Video player is not running");
    }
    return emitSuccess(socket, "Video player is running");
}

function launchYoutubeDl(socket, url) {
    const youtubeUrlPattern = /(http|https):\/\/(www\.|m.|)youtube\.com\/watch\?v=(.+?)( |\z|&)/;
    const youtubeShortLink = /(http|https):\/\/(www\.|)youtu.be\/(.+?)( |\z|&)/;

    if (!youtubeUrlPattern.test(url) || !youtubeShortLink.test(url)) {
        return emitError(socket, 'This url does not match any Youtube short link or Youtube page');
    }

    const options = [];
    youtubedl.getInfo(url, options, (err, info) => {
        if (err) {
            return emitError(socket, err.message);
        }
        launchOmxplayer(socket, info.url);
    });
}

function launchOmxplayer(socket, url) {
    videoPlayer.newSource(url, "hdmi", true, 0);
    emitSuccess(socket, 'Casting your video');
}

function checkUrlRequest(json, socket) {
    if (!json.hasOwnProperty('url')) {
        return emitError(socket, 'The request is malformed, missing url key!');
    }

    return true;
}

function emitSuccess(socket, message) {
    socket.emit('success', message);
    return true;
}

function emitError(socket, message) {
    socket.emit('trouble', message);
    return false;
}

server.listen(port, () => {
    console.log('ActivCast Server Listening on port : ' + port)
});

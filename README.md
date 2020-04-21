# activCast
Nodejs server to cast Videos from YouTube on the RaspberryPi

## Dependencies
Socket.io : enables real-time, bidirectional and event-based communication.  
[node-omxplayer](https://www.npmjs.com/package/node-omxplayer) A library for controlling the Raspberry Pi omxplayer from Node.js.  
[youtube-dl](https://www.npmjs.com/package/youtube-dl) Download videos from youtube in node.js using youtube-dl.  
[dotenv](https://www.npmjs.com/package/dotenv) Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.  

## Install
Clone this repo
```
git clone https://github.com/sldevand/activCast
cd activCast
npm install
```

## Configure
Copy .env.sample file to .env file
```
cp .env.sample .env
```

Edit the .env file with this configuration, tou can change the port as you wish
```
PORT=5901
DEBUG=0
```

## Serve
```
node server.js
```
Result in CLI :
```
ActivCast Server Listening on port : 5901
```

## Author
Sébastien Lorrain

## [License](LICENSE.md)

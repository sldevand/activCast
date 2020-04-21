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

## Add to Systemd

If you want to run the node server.js as a daemon, follow these instructions :

Create a service file
```
[Unit]
Description=ActivCast Youtube Cast Node Server

[Service]
ExecStart=/home/pi/activCast/server.js
Restart=always
User=pi
Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/home/pi/activCast

[Install]
WantedBy=multi-user.target
```

Copy your service file into the /etc/systemd/system.
```
sudo cp /your/path/to/activCast.service /etc/systemd/system
```

Start it with
```
sudo systemctl start activCast.
```

Enable it to run on boot with
```
 systemctl enable activCast
```

See logs with
```
journalctl -u myapp
```

## Author
Sébastien Lorrain

## [License](LICENSE.md)

## Sources

Thanks to [mikemaccana](https://stackoverflow.com/users/123671/mikemaccana) on StackOverflow : [How do I run a node.js app as a background service?](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service/29042953#29042953) 
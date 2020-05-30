const express = require('express');
const serialport = require('serialport');
const socket = require('socket.io');

const Readline = serialport.parsers.Readline;
const app = express();
const server = app.listen(80);
const port = new serialport('COM4', { baudRate: 9600 });
const io = socket(server);
const parser = new Readline('\r\n');

app.use(express.static('public'));
io.sockets.on('connection', gotConnection);
// const parser = port.pipe(new Readline({delimiter: '\r\n'}));
port.pipe(parser);

port.on('error', function(err){
	console.log("Error opening port: " + err.message);
})

port.on("open", function () {
    console.log('Port opened!');
});

parser.on('data', sendData);

function sendData(data){
	var dta = data.toString('utf8');
	io.sockets.emit('sensor', dta);
}

function gotConnection(socket){
	console.log('Here is a new connection');
	socket.on('avoid', gotAvoid);

	function gotAvoid(C){
		var data, c = C.value; 
		if(c == 0)
			data = "0#";
		else if(c == 1)
			data = "1#";
		else if(c == 2)
			data = "2#";
		else if(c == 3)
			data = "a"+"#";
		else if(c == 4)
			data = "n#";

		
		port.write(data, 
			function(err){
				if(err){
					return console.log("Error writing: " + err.message);
				}
				console.log("Sending: " + data + " to the car.");
		});
	}
}
console.log("My server is running!");
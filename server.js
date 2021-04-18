var express = require("express");
const serialport = require("serialport");
// const Readline = require('@serialport/parser-readline');
var Readline = serialport.parsers.Readline;
var app = express();
var server = app.listen(3004);
const port = new serialport("COM4", {
  baudRate: 9600 /*, parser: new Readline({delimiter: '\n'}) */,
});
app.use(express.static("public"));
var socket = require("socket.io");
var io = socket(server);
io.sockets.on("connection", gotConnection);
// const parser = port.pipe(new Readline({delimiter: '\r\n'}));
var parser = new Readline("\r\n");
port.pipe(parser);

port.on("error", function (err) {
  console.log("Error opening port: " + err.message);
});

port.on("open", function () {
  console.log("Port opened!");
});

parser.on("data", sendData);

function sendData(data) {
  var dta = data.toString("utf8");
  io.sockets.emit("sensor", dta);
}

function gotConnection(socket) {
  console.log("Here is a new connection");
  socket.on("voice", gotVoice);
  socket.on("avoid", gotAvoid);

  function gotVoice(C) {
    //socket.broadcast.emit('voice', dat);
    var data;
    let c = C.v;
    if (
      c == "forward" ||
      c == "backward" ||
      c == "left" ||
      c == "right" ||
      c == "stop"
    ) {
      console.log("Receved!");
      if (c == "forward") data = "f#";
      else if (c == "backward") data = "b#";
      else if (c == "left") data = "l#";
      else if (c == "right") data = "r#";
      else if (c == "stop") data = "s#";

      port.write(data, function (err) {
        if (err) {
          return console.log("Error writing: " + err.message);
        }
        console.log("Sending: " + data + " to the car.");
      });
    } else console.log("The car did not understand!");
  }

  function gotAvoid(C) {
    var data,
      c = C.value;
    if (c == 0) data = "0#";
    else if (c == 1) data = "1#";
    else if (c == 2) data = "2#";
    else if (c == 3) data = "a" + "#";
    else if (c == 4) data = "n#";

    port.write(data, function (err) {
      if (err) {
        return console.log("Error writing: " + err.message);
      }
      console.log("Sending: " + data + " to the car.");
    });
  }
}
console.log("My server is running!");

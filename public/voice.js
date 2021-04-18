let socket;
var voice;
var img, imgA;
var flag = true;
var command = {v: ""};

function setup() {
  socket = io.connect();

  img = loadImage('mic.png');
  imgA = loadImage('mic 2.png');
  
  voice = new p5.SpeechRec();
  voice.onResult = showResult;
  
  createCanvas(400,400);
}

function showResult()
{
  //console.log(1);
  command.v = voice.resultString;
  socket.emit('voice', command);
  console.log(command.v);
}

function draw() {
  
    background(220);
    noStroke();
    if(!flag)
      image(img, 150, height-150, 100,100);
    if(flag){
      image(imgA, 150, height-150,100,100);
    }
    textSize(32);
    textAlign(CENTER,CENTER);
    text(command.v, width/2, height/2-100);
    textSize(16);
    text("Commands:\n\t\tForward\n\t\tBackward\n\t\tLeft\n\t\tRight",50,70); 
}
function mousePressed(){
  if(mouseX > 150 && mouseY < height-50 && mouseX < 250 && mouseY > height - 150){
  flag = false;
    voice.start();
  }
}
function mouseReleased(){
  flag = true;
}
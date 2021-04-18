var radio;
var socket;
var voice;
var imgPressed, imgNotPressed;
var flag = true, done = false;
var command = {v: ""};
var buttonA, buttonB, buttonC, buttonD, buttonE, buttonT, buttonR;
var webcamElement, webcam, result;
var count = 0;
var record = 'stop';
var range = [1,2,3,4,5];
const classes = ['forward', 'backwrad', 'left', 'right', 'stop'];
let classifier, net;


function setup() {

  buttonE = createButton('Add NoAction');
  buttonA = createButton('Add Forward');
  buttonB = createButton('Add Backward');
  buttonC = createButton('Add Left');
  buttonD = createButton('Add Right');
  buttonT = createButton('Done');
  buttonR = createButton('Rescan');

  buttonE.position(230, 10);
  buttonA.position(230, 35);
  buttonB.position(230, 60);
  buttonC.position(230, 85);
  buttonD.position(230, 110);
  buttonT.position(230, 150);
  buttonR.position(337, 150);

  buttonA.mousePressed(() => {
   for(let i of range)
      addClass(0)
  });
  buttonB.mousePressed(() => {
   for(let i of range)
      addClass(1)
  });
  buttonC.mousePressed(() => {
   for(let i of range)
      addClass(2)
  });
  buttonD.mousePressed(() => {
   for(let i of range)
      addClass(3)
  });
  buttonE.mousePressed(() => {
   for(let i of range)
      addClass(4)
  });
  buttonT.mousePressed(() => done = true);
  buttonR.mousePressed(() => app());

  webcamElement = document.getElementById('webcam');
  
  socket = io.connect();

  imgPressed = loadImage('mic.png');
  imgNotPressed = loadImage('mic 2.png');
  
  voice = new p5.SpeechRec();
  voice.onResult = showResult;
  app();
  
  createCanvas(400,400);
}

function draw() {
  if(1){

    background(230);
    noStroke();
    if(!flag)
      image(imgPressed, 150, height-150, 100,100);
    if(flag){
      image(imgNotPressed, 150, height-150,100,100);
    }
    textSize(32);
    textAlign(CENTER,CENTER);
    text(command.v, width/2, height/2-100);
    textSize(16);
    text("Commands:\n\t\tForward\n\t\tBackward\n\t\tLeft\n\t\tRight",50,70);

    //Gesture recognition
    readCam();
    setInterval(sendData, 1000);
  }
}

async function readCam(){
  if (classifier.getNumClasses() > 0) {
        const img = await webcam.capture();
        const activation = net.infer(img, 'conv_preds');
        result = await classifier.predictClass(activation);  
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${result.confidences[result.label]}
        `;
        img.dispose();
      }
}

const addClass = async classId => {
  const img = await webcam.capture();
  const activation = net.infer(img, 'conv_preds');
  classifier.addExample(activation, classId);
  img.dispose();
};

async function app(){
  classifier = knnClassifier.create();
  console.log('Loading MobileNet...');
  net = await mobilenet.load();
  console.log("Successfully Loaded model");
  webcam = await tf.data.webcam(webcamElement);
}

function sendData(){
  if((done == true) && (record != classes[result.label]) && (classes[result.label] != 'stop')){
    console.log("Sending: "+classes[result.label])
    command.v = classes[result.label];
    socket.emit('voice', command);
    record = classes[result.label];
  }
}

function showResult()
{
  console.log(1);
  command.v = voice.resultString;
  socket.emit('voice', command);
  console.log(command.v);
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

// while (true) {
  //   //console.log(1);
  //   var result;
    
  //   if(radio.value() != 'Gesture Recognition'){
  //     console.log(1);
  //     break;
  //   }
  //   if (classifier.getNumClasses() > 0) {
      // const img = await webcam.capture();

      // // Get the activation from mobilenet from the webcam.
      // const activation = net.infer(img, 'conv_preds');
      // // Get the most likely class and confidence from the classifier module.
      // result = await classifier.predictClass(activation);

      
      // p.innerText = `
      //   prediction: ${classes[result.label]}\n
      //   probability: ${result.confidences[result.label]}
      // `;
      // //console.log(classes[result.label]);
      // // Dispose the tensor to release the memory.
      // img.dispose();
  //   }
    // var rslt = classes[result.lable];
    // setTimeout(() =>{
      // if((done == true) && (record != classes[result.label]) && (classes[result.label] != 'stop')){
      // //console.log(classes[result.label])
      // command.v = classes[result.label];
      // socket.emit('voice', command);
      // record = classes[result.label];
      // }
    // }, 1000);
    

    //await tf.nextFrame();
//}
    // webcamElement.style.display = 'none';
    // p.style.display = 'none';
    // console.log(2);
    // buttonA.remove();
    // buttonB.remove();
    // buttonC.remove();
    // buttonD.remove();
    // buttonE.remove();
    // buttonT.remove();
    // createCanvas(400,400);
    // count = 0;
    //Making predictions
    // const img = document.getElementById('img');
    // const rslt = await net.classify(img);
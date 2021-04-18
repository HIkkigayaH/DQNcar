var buttonA, buttonB, buttonC, buttonD;
var webcam, result, webcamElement;
const classifier = knnClassifier.create();
let net; 
function setup() {

  buttonA = createButton('Add Forward');
  buttonB = createButton('Add Backward');
  buttonC = createButton('Add Left');
  buttonD = createButton('Add Right');
  buttonA.position(10, 300);
  buttonB.position(10, 320);
  buttonC.position(10, 340);
  buttonD.position(10, 360);

  const range = [1,2,3,4,5];
    buttonA.mousePressed(() => {
      for(const i of range){
        addExample(0)
      }
    });
    buttonB.mousePressed(() => {
      for(const i of range){
        addExample(1)
      }
    });
    buttonC.mousePressed(() => {
      for(const i of range){
        addExample(2)
      }
    });
    buttonD.mousePressed(() => {
      for(const i of range){
        addExample(3)
      }
    });
  //var vdo = createCapture(VIDEO);

  webcamElement = document.getElementById('webcam');
  //webcamElement.remove();
  

  app();
  
 }
 function draw(){
   readCam();
 }

 async function app(){
    console.log('Loading MobileNet...');
    net = await mobilenet.load();
    console.log("Successfully Loaded model");
    webcam = await tf.data.webcam(webcamElement);
    //Making predictions
    // const img = document.getElementById('img');
    // const rslt = await net.classify(img); 
  }

 const addExample = async classId => {
      // Capture an image from the web camera.
      const img = await webcam.capture();

      // Get the intermediate activation of MobileNet 'conv_preds' and pass that
      // to the KNN classifier.
      const activation = net.infer(img, 'conv_preds');

      // Pass the intermediate activation to the classifier.
      classifier.addExample(activation, classId);

      // Dispose the tensor to release the memory.
      img.dispose();
    };
async function readCam(){
  if (classifier.getNumClasses() > 0) {
        const img = await webcam.capture();

        // Get the activation from mobilenet from the webcam.
        const activation = net.infer(img, 'conv_preds');
        // Get the most likely class and confidence from the classifier module.
        result = await classifier.predictClass(activation);

        const classes = ['Forward', 'Backward', 'Left', 'Right'];
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${result.confidences[result.label]}
        `;
        console.log(classes[result.label]);
        // Dispose the tensor to release the memory.
        img.dispose();
      }
}


// function draw() {
//   background(0);
// }
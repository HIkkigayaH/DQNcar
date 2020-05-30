var socket, startbtn, pausebtn;
var agent;
const MAX_DIST = 30;
function setup() {

	startbtn = createButton('Start');
	startbtn.mousePressed(() => {
		agent = new Agent();
		agent.loadBrain();
		sendData(3);
	});

	pausebtn = createButton('Pause');
	pausebtn.mousePressed(() => sendData(4));

	socket = io.connect();
	socket.on('sensor', data => {
		SV = data.split(' ').map(function(item){
			return parseInt(item);
		});
		// console.log(SV);
		const state = tf.tidy(() => normalize(SV));
	    console.log(state);
		var action = tf.tidy(() => agent.takeAction(state));
		update(action);
		console.log(action)
		// delay(22).then(() => console.log(action));
	});
}
function draw(){
	// if(got && loaded && !pause){
	// 	getState();
	// 	got = false
	// }
	noLoop();
}

function normalize(s){
	const s_t = tf.tensor1d(s);
    const divider = tf.scalar(MAX_DIST);
    return s_t.div(divider).arraySync();
}

function delay(ms){
	return new Promise((resolve, reject) => {
		setTimeout(function(){resolve()}, ms);
	});
}
function update(a){
	sendData(a)
}

function Agent(){

	this.loadBrain = async function(){
		const uploadJSONInput = document.getElementById('upload-json');
		const uploadWeightsInput = document.getElementById('upload-weights');
		this.brain = await tf.loadLayersModel(tf.io.browserFiles([uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
		console.log(this.brain);
		console.log('Model Loaded!');
		loaded = true
	}

	this.takeAction = function(state){
		const s = tf.tensor2d(state,[1,5]);
		var op = this.brain.predict(s).as1D().argMax().dataSync()[0];
		s.dispose();
		return op;
	}
}

function sendData(d){
	const command = {value: d};
	socket.emit('avoid', command);
}
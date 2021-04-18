var env, agent, pair, D, loss;
var flag = false, prevAction = 2, modeloaded = false, testbtn, setEnv, trainbtn, loadedexp = [], exp1, exp2;

// function preload(){
// 	exp1 = loadJSON(url1);
// 	// exp2 = loadJSON(url2);
// }

function setup(){
	// mergeExp();
	testbtn = createButton('Test');
	setEnv = createButton('Set Env');
	trainbtn = createButton('Train');
	setEnv.mousePressed(() => {
		env = new Environment(50);
		env.mover.update(random([0, 1, 2]));
	});
	testbtn.mousePressed(() => {
		env = new Environment(50);
		env.mover.update(random([0, 1, 2]));
		agent = new Agent();
		agent.loadBrain();
		console.log('Model loaded');
	});
	trainbtn.mousePressed(() => {
		D = new ReplayBuffer(bufferSize);
		agent = new Agent(5,3);
		agent.loadBrain(1);
	})
	createCanvas(500,500);

	if(mode == TRAINING){
		D = new ReplayBuffer(bufferSize);
		// D.buffer = exp1.data;
		agent = new Agent(5,3);
		agent.getABrainAndTarget();
	}
	else if(mode == TESTING){
		env = new Environment(50);
		env.mover.update(random([0, 1, 2]));
	}
	
	frameRate(100);
}
function draw(){
	if(mode == TRAINING){
		if(D.buffer.length >= bufferThreshold){
			flag = true;
		}
		console.log(tf.memory().numTensors);
		if(epochs > 0){
			background(0);
			env = new Environment(random(40,70));
			env.mover.update(random([0, 1, 2]));
			for(let j = 0; j< episodeN; j++){
				pair = {
					state: null,
					action: null,
					reward: null,
					nextState: null,
					done: 0
				};

				pair.state = env.getState();
				if(random() < epsilon){
					pair.action = tf.tidy(() => agent.takeAction(pair.state));
				}
				else{
					if(random() < 0.7)
						pair.action = prevAction;
					else{
						pair.action = random([0, 1, 2]);
						prevAction = pair.action;
					}
				} 

				var state_reward = env.update(pair.action);
				pair.reward = state_reward.reward;
				pair.nextState = state_reward.state;
				pair.done = state_reward.done;

				D.memorize(pair);
				if(flag){
					var sample = D.sample(batchSize);
					agent.learn(sample);
					epsilon += epsilonRate;	
				}	
				if(pair.done)
					break;

			}

			if(flag){
				epochs--;
				targetnetC--;
			}

			console.log(epochs);

			if(targetnetC == 0){
				agent.updateTargetNet();
				targetnetC = targetnetF; 
			}
			
		}
		else{
			console.log("Training Complete!");
			saveModel();
			splitAndSave();
			env = new Environment(20);
			env.mover.update(random([0, 1, 2]));
			mode = TESTING;
		}
	}
	else{
		if(modeloaded){
			background(0);
			const state = env.getState();
			const action = random()<0.95 ? agent.takeAction(state) : random([0.1,2]);
			env.update(action).state;
		}
	}
}

async function saveModel(){
	await agent.brain.save(path);
	console.log('Model saved!!');
}

function mergeExp(){
	// for(var o of exp1.data)
	// 	loadedexp.push(o)
	// for(var o of exp2.data)
	// 	loadedexp.push(o)
	for(let i = 0; i < 400000; i++){
		if(random() < 0.5)
			loadedexp.push(random(exp1.data));
		else
			loadedexp.push(random(exp2.data));
	}

}

function splitAndSave(){
	var counter = 0;
	var json1 = {data: []};
	var json2 = {data: []};
	for(let n of D.buffer){
		if(counter <= D.buffer.length/2)
			json1.data.push(n);
		else
			json2.data.push(n)
		counter++;
	}
	saveJSON(json1, 'exp1_c.json');
	saveJSON(json2, 'exp2_c.json');
	console.log('Saved data');
}

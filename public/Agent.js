function Agent(input_dim, output_dim){
	this.input_dim = input_dim;
	this.output_dim = output_dim;
	// this.brain = nn.createDQN(this.input_dim, this.output_dim);
	// this.targetNet = nn.createDQN(this.input_dim, this.output_dim);
	// this.targetNet.trainable = false;
	this.discount = 0.99999;
	this.lr = 0.0001;
	this.optimizer = tf.train.adam(this.lr, 0.9, 0.999, 0.000000001);
	this.counter = 0;
	// nn.copyWeights(this.brain, this.targetNet);

	this.getABrainAndTarget = function(){
		this.brain = nn.createDQN(this.input_dim, this.output_dim);
		this.targetNet = nn.createDQN(this.input_dim, this.output_dim);
		this.targetNet.trainable = false;
		nn.copyWeights(this.brain, this.targetNet);
	}

	this.loadBrain = async function(op){
		const uploadJSONInput = document.getElementById('upload-json');
		const uploadWeightsInput = document.getElementById('upload-weights');
		this.brain = await tf.loadLayersModel(tf.io.browserFiles([uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
		if(op){
			this.targetNet = await tf.loadLayersModel(tf.io.browserFiles([uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
			this.targetNet.trainable = false;
			mode = TRAINING;
		}
		else
			modeloaded = true;
	}

	this.takeAction = function(state){
		const s = tf.tensor2d(state,[1,5]);
		var op = this.brain.predict(s).as1D().argMax().dataSync()[0];
		s.dispose();
		return op;
	}

	this.getTarget = function(s){
		var a_max = [];
		for(var S of s.nextState)
			a_max.push(this.takeAction(S));
		const donemusk = tf.ones([batchSize]).sub(tf.tensor1d(s.done));
		const discount = tf.scalar(this.discount);
		const reward = tf.tensor1d(s.reward);
		const predT = this.targetNet.predictOnBatch(tf.tensor2d(s.nextState));
		const onehotmusk = tf.oneHot(tf.tensor1d(a_max, 'int32'),3);
		const onehotted = predT.mul(onehotmusk).sum(-1);
		const result = reward.add(onehotted.mul(discount).mul(donemusk));

		return result;
	}

	this.Loss = function(s){
		const target = tf.tidy(() => this.getTarget(s));
		var pred = this.brain.predictOnBatch(tf.tensor2d(s.state));
		pred = pred.mul(tf.oneHot(tf.tensor1d(s.action, 'int32'),3)).sum(-1);
		const loss = tf.losses.meanSquaredError(target, pred);
		if(this.counter == 0){
			loss.print();
			this.counter = 1000;
		}
		this.counter--;
		return loss;
	}

	this.learn = function(sample){tf.tidy(() =>
		this.optimizer.minimize(() => this.Loss(sample))
	)}

	this.updateTargetNet = function(){
		if(!this.targetNet.trainable)
			this.targetNet.trainable = true;
		nn.copyWeights(this.brain, this.targetNet);
		this.targetNet.trainable = false;
		console.log('target updated');
	}
}
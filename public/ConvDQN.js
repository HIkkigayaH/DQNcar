class NN{

	createConvDQN(input_dim, output_dim){
		const model = tf.sequential();
		model.add(tf.layers.conv2d({
			inputShape: input_dim, 
			filters: 32, 
			kernelSize: 8, 
			strides: 4, 
			activation: 'relu',
			dataformat: 'channelLast'
		}));
		model.add(tf.layers.batchNormalization());
		model.add(tf.layers.conv2d({
			filters: 64, 
			kernelSize: 4, 
			strides: 2, 
			activation: 'relu'
		}));
		model.add(tf.layers.batchNormalization());
		model.add(tf.layers.conv2d({
			filters: 64, 
			kernelSize: 3, 
			strides: 1, 
			activation: 'relu'
		}));
		model.add(tf.layers.flatten());
		model.add(tf.layers.dense({units: 64, activation: 'relu'}));
		model.add(tf.layers.dropout({rate: 0.25}));
		model.add(tf.layers.dense({units: output_dim, activation: 'softmax'}));
		//this.conv.add(tf.layers.reLU());

		return model;
	}

	createDQN(input_dim, output_dim){
		const model = tf.sequential();
		model.add(tf.layers.dense({inputDim: input_dim, units: 5}))
		model.add(tf.layers.dense({units: hidden_units, activation: 'relu'}));
		model.add(tf.layers.dense({units: hidden_units, activation: 'relu'}));
		model.add(tf.layers.dense({units: hidden_units, activation: 'relu'}));
		// model.add(tf.layers.dropout({rate: 0.15}));
		model.add(tf.layers.dense({units: output_dim}));

		return model;
	}

	copyWeights(srcNet, destNet){
		destNet.setWeights(srcNet.getWeights());
	}
}
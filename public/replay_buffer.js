function ReplayBuffer(maxLen){
	this.maxLen = maxLen;
	this.buffer = [];
	this.length;
	this.indecies = [];

	this.initIndex = function(){
		for(let i = 0; i < this.buffer.length; i++){
			this.indecies.push(i);
		}
	}

	this.memorize = function(Pair){
		var flag = false;
		for(let n of Pair.state)
			if(n != 1){
				// console.log(Pair.state);
				flag = true;
				break;
			}
		if(flag || random() < 0.09){
			// console.log('added the shit');
			this.buffer.push(Pair);
		}
		// else
			// console.log('disnot add the shit');
		
		this.length = this.buffer.length;
		if(this.length >= this.maxLen){
			this.buffer.shift();
		}
	}

	this.sample = function(batchsize){
		this.initIndex();
		var smpl = {
			state: [],
			action: [],
			reward: [],
			nextState: [],
			done: []
		};
		var I;
		for(let i = 0; i < batchsize; i++){
			I = random(this.indecies);
			smpl.state.push(this.buffer[I].state);
			smpl.action.push(this.buffer[I].action);
			smpl.reward.push(this.buffer[I].reward);
			smpl.nextState.push(this.buffer[I].nextState);
			smpl.done.push(this.buffer[I].done);
			this.indecies.splice(this.indecies.indexOf(I),1);
		} 
		this.indecies = [];
		return smpl;
	}
}
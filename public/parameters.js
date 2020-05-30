var epochs = 100;
var epsilon = 0;
const episodeN = 3000;
const epsilonRate = 50/(epochs*episodeN);
const batchSize = 32;
const targetnetF = 1500;
const bufferSize = 500000; 
const hidden_units = 128;
const bufferThreshold = 450000;

var targetnetC = targetnetF;
const nn = new NN();
const path = 'downloads://brain_100_merged_2';

var TRAINING = 1
var TESTING = 2
var mode = 1;
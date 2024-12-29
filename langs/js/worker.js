const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const data = {
	count: 0,
	stopTime: 1000,
	initTime: null,
	exitTime: null,
	prevTime: null,
	valid: false,
	threadId: null,
	workerId: null,
};

if ( !isMainThread ) {
	let count = 0;
	data.threadId = workerData.threadId;
	data.workerId = workerData.workerId;
	data.initTime = workerData.initTime;
	data.prevTime = workerData.prevTime;
	data.poop = {'prevTime+endTime' : data.prevTime+workerData.endTime};
	const endTime = data.prevTime + workerData.endTime;
	data.endTime = endTime;
	data.exitTime = performance.now();
	if (data.exitTime < endTime) {
		data.valid = true;
	}
	while (data.exitTime < endTime) {
		count++;
		data.exitTime = performance.now();
	}
	data.prevTime += data.exitTime;
	data.count = count;
	parentPort.postMessage(data);
	process.exit();
}

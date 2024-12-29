const data = {
	count: 0,
	stopTime: 1000,
	initTime: null,
};

self.onmessage = (event) => {
	data.initTime = event.data;
	let count = 0;
	while (performance.now() < data.stopTime) {
		count++
	}
	data.count = count;
	postMessage(data);
	self.close();
}

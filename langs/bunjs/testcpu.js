// const worker = new Worker("./worker.js");

function test_single() {
	const stopTime = performance.now() + 1000;

	let count = 0;
	while (performance.now() < stopTime) {
		count++
	}

	return count;
}

async function test_multi(workers=1) {
	var promise = new Promise(function(resolve, reject) {
		let counter = 0;
		let count = 0;

		if (workers <= 0) {
			return 0;
		}
		const workerhub = [];
		const stopTime = performance.now() + 1000;
		for (let i = 1; i < workers; i++ ) {

			// we will allow ourselves 1 entire second to make 
			// as many workers as we can. Then we'll allow all of those 
			// workers to get one second running and counting
			const curTime = performance.now();
			if (curTime < stopTime) {
				const worker = new Worker("./worker.js");
				worker._alive = false;
				
				worker.addEventListener('open', event => {
					worker._alive = true;
					worker.postMessage(performance.now());
				});
				worker.onmessage = (event) => {
					const data = event.data;
					count += data.count;
				};
				worker.addEventListener('close', event => {
					counter++;

					if (counter >= workerhub.length) {
						worker.terminate();
						resolve({ count: count, workers: workerhub.length });
					}
				});

				workerhub.push(worker);
			} else {
				// we ran out of time generating workers. lmao
				break;
			}
		}

		for ( let i = 0; i < workerhub.length; i++ ) {
			// console.log('sending message to my workers', performance.now());
			if (workerhub[i]._alive == false) {
				workerhub[i]._alive = true;
				workerhub[i].postMessage(performance.now());
			}
		}

	});

	return promise;
}

for ( let i = 0; i < 3; i++ ) {
	const count = test_single();
	console.log(`test_single() = `, count.toLocaleString());
}


for ( let i = 0; i < 1; i++ ) {
	const data = await test_multi(4);
	console.log(`test_multi(4:${data.workers}) = `, data.count.toLocaleString());
}
for ( let i = 0; i < 1; i++ ) {
	const data = await test_multi(8);
	console.log(`test_multi(8:${data.workers}) = `, data.count.toLocaleString());
}
for ( let i = 0; i < 1; i++ ) {
	const data = await test_multi(100);
	console.log(`test_multi(100:${data.workers}) = `, data.count.toLocaleString());
}
for ( let i = 0; i < 1; i++ ) {
	const data = await test_multi(1000);
	console.log(`test_multi(1000:${data.workers}) = `, data.count.toLocaleString());
}


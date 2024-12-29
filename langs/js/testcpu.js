const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// Main test_multi function
async function test_multi(iter, seconds = 1, workers = 1, prevTime = 0) {
    return new Promise(async (resolve) => {
		let count = 0;
        let completed = 0;
		let pending = 0;
		const workerhub = new Array(workers).fill(0);
		const dataHub   = new Array(workers).fill({});
			
		const stopTime = performance.now() + 1000 + prevTime;
		for (let w = 0; w < workers; w++) {
			if (performance.now() < stopTime && performance.now() < (prevTime+1000)) {
				const hub = {
					workerId: w,
					count: 0,
					initTime: performance.now(),
					endTime: 1000,
					workers: workers,
					prevTime: prevTime,
					_alive: true,
					threadId: null,
				};
				const worker = new Worker("./worker.js", { 
					workerData: hub,
				});
				hub.threadId = worker.threadId;
				dataHub[w] = hub;

				worker._alive = false;
				worker.on('message', (data) => {
					// console.log(
					// 	`#${data.workerId}-[${data.initTime}:${data.exitTime}]`,
					// 	`${(count+data.count).toLocaleString()}`
					// );
					// console.log("message", data);
					count += data.count;
				});

				worker.on('online', (e) => {
					// console.log("worker went online", workerhub[worker.threadId]);
					worker._alive = true;
					if (dataHub[worker.threadId] ) {
						dataHub[worker.threadId].threadId = worker.threadId;
					}
					pending++;
				});

				worker.on('error', (err) => {
					console.error(`Worker ${w} encountered an error:`, err);
					completed++;

					if (completed === workers) {
						const totalCount = 0;
						console.log(`${iter}. test_multi(${iter}, ${workers}) -> `, totalCount.toLocaleString());
						resolve({
							workerId: workers,
							count: totalCount,
							endTime: performance.now(),
							workers: workerhub.length,
						});
					}
				});

				worker.on("exit", (code) => {
					completed++;
					pending--;

					if (completed === workerhub.length || pending == 0) {
						const totalCount = count;
						console.log(
							`${iter}. test_multi(${iter}, ${workers}) [${workerhub.length}] -> ${totalCount.toLocaleString()}`,
						);
						resolve({
							workerId: workers,
							count: totalCount,
							prevTime: performance.now(),
							workers: workerhub.length,
						});
					}
				})

				workerhub[w] = worker;
			}
        }
	
		await sleep(1000);

		// let waiting = 0;
		// if (pending > 0 ) {
		// 	console.log("Waiting on ", pending, "resolves");
		// 	await sleep(100);
		// 	const totalCount = count;
		// 	let totalWorkers = 0;
		// 	for ( let j = 0; j < workerhub.length; j++ ) {
		// 		const dub = workerhub[j];
		//
		// 	}
		// 	console.log(
		// 		`${iter}. test_multi(${iter}, ${workers}) [${workerhub.length}] -> ${totalCount.toLocaleString()}`,
		// 	);
		// 	resolve({
		// 		workerId: workers,
		// 		count: totalCount,
		// 		prevTime: performance.now(),
		// 		workers: workerhub.length,
		// 	});
		// }
		// if (waiting > 0) {
		// 	console.log("Turning on", waiting, "manually");
		// }
    });
}


function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function test_single(iter=0, seconds=1) {
	const end = (new Date().getTime()) + seconds * 1000;

	let i = 0;
	do {
		i++;

		if ((new Date()).getTime() > end) {
			break;
		}
	} while (true);

	console.log(`${iter}. test_single(${iter}, ${seconds}) -> `, i.toLocaleString());
}

function test_single_perf_now(iter=0, seconds=1) {
	const start = performance.now();
	const ms = seconds * 1000;

	let i = 0;
	do {
		i++;

		if (performance.now() - start > ms) {
			break;
		}
	} while(1);

	console.log(`${iter}. test_single_perf_now(${iter}, ${seconds}) -> `, i.toLocaleString());
}

async function run_next_test(tests, prevTime=0) {
	let out = null;
	let workers = null;
	if (tests && tests.length) {
		workers = tests.shift();
		// console.log("Starting tests for ", workers, prevTime);
	} else {
		return false;
	}

	out = await test_multi(1, 1, workers, prevTime); // Example: iter=1, seconds=1, workers=4
	// console.log("output is ", out);
	if (out && out.count && tests.length > 0) {
		return await run_next_test(tests, out.prevTime);
	}
}

console.log("Using (new Date()).getTime()")
for ( let i = 0; i < 3; ++i ) {
	(async () => { await test_single(i, 1); })();
}

console.log("Using performance.now() instead of (new Date()).getTime()")
for ( let i = 0; i < 3; ++i ) {
	(async () => { await test_single_perf_now(i, 1); })();
}



console.log("Workers");
let running = 0;
let out = null;
const tests = [
	2, 4, 8, 16, 32
];

(async () => {
	out = await run_next_test(tests, performance.now());
})();

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// Worker code that performs counting
if (!isMainThread) {
    const { seconds } = workerData;
    const stopTime = performance.now() + seconds * 1000;

    let count = 0;
    while (performance.now() < stopTime) {
        count++;
    }

    parentPort.postMessage(count);
    process.exit(0);
}

// Main test_multi function
function test_multi(iter, seconds = 1, workers = 1) {
    return new Promise((resolve) => {
        const counts = new Array(workers).fill(0);
        let completed = 0;

        for (let w = 0; w < workers; w++) {
            const worker = new Worker(__filename, { workerData: { seconds } });

            worker.on('message', (count) => {
                counts[w] = count;
                completed++;

                if (completed === workers) {
                    const totalCount = counts.reduce((sum, val) => sum + val, 0);
                    console.log(`${iter}. test_multi(${iter}, ${seconds}, ${workers}) -> `, totalCount.toLocaleString());
                    resolve(totalCount);
                }
            });

            worker.on('error', (err) => {
                console.error(`Worker ${w} encountered an error:`, err);
                completed++;

                if (completed === workers) {
                    const totalCount = counts.reduce((sum, val) => sum + val, 0);
                    console.log(`${iter}. test_multi(${iter}, ${seconds}, ${workers}) -> `, totalCount.toLocaleString());
                    resolve(totalCount);
                }
            });
        }
    });
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


// Example usage
if (isMainThread) {
	console.log("Using (new Date()).getTime()")
	for ( let i = 0; i < 3; ++i ) {
		test_single(i, 1);
	}

	console.log("Using performance.now() instead of (new Date()).getTime()")
	for ( let i = 0; i < 3; ++i ) {
		test_single_perf_now(i, 1);
	}

	console.log("Workers");
	for ( let i = 0; i < 1; ++i ) {
		(async () => {
			await test_multi(1, 1, 4); // Example: iter=1, seconds=1, workers=4
		})();
	}
	for ( let i = 0; i < 1; ++i ) {
		(async () => {
			await test_multi(1, 1, 8); // Example: iter=1, seconds=1, workers=4
		})();
	}
	for ( let i = 0; i < 1; ++i ) {
		(async () => {
			await test_multi(1, 1, 100); // Example: iter=1, seconds=1, workers=4
		})();
	}
	for ( let i = 0; i < 1; ++i ) {
		(async () => {
			await test_multi(1, 1, 1000); // Example: iter=1, seconds=1, workers=4
		})();
	}
}

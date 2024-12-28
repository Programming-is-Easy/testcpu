<?php

function test_single($iter = 0, $seconds = 1) {
    $start_time = microtime(true);
    $count = 0;

    while ((microtime(true) - $start_time) < $seconds) {
        $count++;
    }

    printf("%d. test_single(%d, %d) -> %s\n", $iter, $iter, $seconds, number_format($count));
}

function worker($seconds) {
    $end_time = microtime(true) + $seconds;
    $count = 0;

    while (microtime(true) < $end_time) {
        $count++;
    }

    return $count;
}

function test_multi($iter = 0, $seconds = 1, $workers = 1) {
    $runtimes = [];
    $promises = [];

    for ($w = 0; $w < $workers; $w++) {
        $runtime = new \parallel\Runtime();
        $promises[] = $runtime->run(function($seconds) {
			$end_time = microtime(true) + $seconds;

			$count = 0;

			while (microtime(true) < $end_time ) {
				$count++;
			}

			return $count;
        }, [$seconds]);
        $runtimes[] = $runtime;
    }

	$counts = []; 
	foreach ( $promises as $promise ) {
		$counts[] = $promise->value();
	}

    // $counts = array_map(fn($promise) => $promise->value(), $promises);
	
	gc_collect_cycles();

    $total_count = array_sum($counts);
    printf("%d. test_multi(%d, %d, %d) -> %s\n", $iter, $iter, $seconds, $workers, number_format($total_count));
    return $total_count;
}

// Example usage
if (PHP_SAPI === 'cli') {

    echo "Using microtime(true)\n";
    for ($i = 0; $i < 3; $i++) {
        test_single($i, 1);
    }

	/*
    echo "Workers\n";
    for ($i = 0; $i < 1; $i++) {
        test_multi(1, 1, 4); // Example: iter=1, seconds=1, workers=4
    }
    for ($i = 0; $i < 1; $i++) {
        test_multi(1, 1, 8); // Example: iter=1, seconds=1, workers=8
    }
	*/
    for ($i = 0; $i < 1; $i++) {
        test_multi(1, 1, 100); // Example: iter=1, seconds=1, workers=100
    }
    for ($i = 0; $i < 1; $i++) {
        test_multi(1, 1, 1000); // Example: iter=1, seconds=1, workers=1000
    }
}


package main

import (
	"fmt"
	"sync"
	"time"

	"example.com/testcpu/color"

	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

func worker(
	seconds int,
	count *int64,
	wg *sync.WaitGroup,
) {
	defer wg.Done()

	stopTime := time.Now().Add(time.Duration(seconds) * time.Second)

	for time.Now().Before(stopTime) {
		(*count)++
	}
}

func test_multi(iter int, seconds int, workers int) int64 {
	counts := make([]int64, workers)

	var wg sync.WaitGroup

	for w := 0; w < workers; w++ {
		wg.Add(1)
		go worker(seconds, &counts[w], &wg)
	}

	wg.Wait()

	var count int64
	for _, workercount := range counts {
		count += workercount
	}

	p := message.NewPrinter(language.English)
	funcStr := fmt.Sprintf("%s%d%s iter.%s, %d%s sec%s, %d%s workers",
		color.E_BLUE, iter, color.E_MUTE,
		color.E_BLUE, seconds, color.E_MUTE,
		color.E_BLUE, workers, color.E_MUTE,
	)
	fmt.Printf(
		"%d. %stest_multi(%s%s) -> i = %s%s%s\n",
		iter, color.E_GREEN, funcStr, color.E_GREEN,
		color.E_YELLOW,
		p.Sprintf("%d", count),
		color.Reset,
	)

	return count
}

func test_single(iter int, seconds int) int64 {
	start := time.Now()

	i := int64(0)
	for {
		i++

		elapsed := time.Since(start)

		if elapsed >= time.Second*time.Duration(seconds) {
			break
		}
	}

	p := message.NewPrinter(language.English)
	funcStr := fmt.Sprintf("%s%d%s iterations%s, %d%s seconds",
		color.E_BLUE, iter, color.E_MUTE,
		color.E_BLUE, seconds, color.E_MUTE,
	)
	fmt.Printf(
		"%d. %stest_single(%s%s) -> i = %s%s%s\n",
		iter, color.E_GREEN, funcStr, color.E_GREEN,
		color.E_YELLOW,
		p.Sprintf("%d", i),
		color.Reset,
	)

	return i
}

func main() {

	tests := map[string][]int64{
		"test_single":   make([]int64, 0),
		"test_multi_2":  make([]int64, 0),
		"test_multi_4":  make([]int64, 0),
		"test_multi_6":  make([]int64, 0),
		"test_multi_8":  make([]int64, 0),
		"test_multi_10": make([]int64, 0),
		"test_multi_12": make([]int64, 0),
		"test_multi_16": make([]int64, 0),
		"test_multi":    make([]int64, 0),
	}

	for i := 0; i < 3; i++ {
		iters := test_single(i, 1)
		tests["test_single"] = append(tests["test_single"], iters)
	}
	time.Sleep(2 * time.Second)

	for i := 0; i < 1; i++ {
		iters := test_multi(i, 1, 2)
		tests["test_multi_2"] = append(tests["test_multi_2"], iters)
	}
	time.Sleep(2 * time.Second)

	for i := 0; i < 1; i++ {

		iters := test_multi(i, 1, 4)
		tests["test_multi_4"] = append(tests["test_multi_4"], iters)
	}
	// time.Sleep(2 * time.Second)
	//
	// fmt.Println("Starting octo thread counter")
	for i := 0; i < 1; i++ {

		iters := test_multi(i, 1, 6)
		tests["test_multi_8"] = append(tests["test_multi_8"], iters)
	}
	// time.Sleep(2 * time.Second)
	//
	// fmt.Println("Starting twelvo thread counter")
	for i := 0; i < 1; i++ {
		iters := test_multi(i, 1, 8)
		tests["test_multi_12"] = append(tests["test_multi_12"], iters)
	}
	// time.Sleep(2 * time.Second)
	//
	// fmt.Println("Starting doubleoct thread counter")
	for i := 0; i < 1; i++ {
		iters := test_multi(i, 1, 12)
		tests["test_multi_16"] = append(tests["test_multi_16"], iters)
	}
	// time.Sleep(2 * time.Second)

	fmt.Println("Starting CPU-peg thread counter [100 threads]")
	for i := 0; i < 1; i++ {
		iters := test_multi(i, 1, 100)
		tests["test_multi"] = append(tests["test_multi"], iters)
	}

	fmt.Println("Starting CPU-peg++ thread counter [1000 threads]")
	for i := 0; i < 1; i++ {
		iters := test_multi(i, 1, 1000)
		tests["test_multi_14"] = append(tests["test_multi_14"], iters)
	}

	// p := message.NewPrinter(language.English)
	// for test, times := range tests {
	// 	sum := int64(0)
	// 	amt := int64(0)
	//
	// 	if len(times) == 0 {
	// 		continue
	// 	}
	// 	for _, val := range times {
	// 		amt++
	// 		sum += val
	// 	}
	//
	// 	fmt.Printf(
	// 		"\t%s[%s%s%s]%s -> = %s%s%s avg.,  %s%s%s total%s\n",
	// 		color.E_GREEN, color.E_BLUE, p.Sprintf("%d", amt), color.E_GREEN,
	// 		test,
	// 		color.E_YELLOW, p.Sprintf("%d", (sum/amt)), color.E_MUTE,
	// 		color.E_ORANGE, p.Sprintf("%d", sum), color.E_MUTE, color.Reset,
	// 	)
	//
	// }
}

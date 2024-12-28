#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>
#include <pthread.h>

// Struct to pass data to worker threads
typedef struct {
    uint64_t *count;
    int seconds;
} WorkerArgs;

typedef struct {
    uint64_t *count;
    char padding[64];
} AlignedCounter;

// Worker function executed by each thread
void *worker(void *arg) {
    AlignedCounter *counter = (AlignedCounter *)arg;

    struct timespec start_time, current_time;
    clock_gettime(CLOCK_MONOTONIC, &start_time);

    // Calculate stop time
    time_t stop_time = start_time.tv_sec + 1;

    // Count as fast as possible
    while (1) {
		counter->count++;
        clock_gettime(CLOCK_MONOTONIC, &current_time);
        if (current_time.tv_sec >= stop_time) {
            break;
        }
    }

    return NULL;
}

// test_multi function to create threads, aggregate results, and return total count
uint64_t test_multi(int workers, int seconds) {
    pthread_t threads[workers];
    AlignedCounter counts[workers];       // Array to store counts for each thread
    WorkerArgs args[workers];       // Array to pass arguments to each thread

    // Initialize counts and create threads
    for (int i = 0; i < workers; i++) {
        counts[i].count = 0;
	}

	for (int i = 0; i < workers; i++ ) {
        if (pthread_create(&threads[i], NULL, worker, &counts[i]) != 0) {
            perror("Failed to create thread");
            exit(EXIT_FAILURE);
        }
    }

    // Wait for all threads to complete
    for (int i = 0; i < workers; i++) {
        pthread_join(threads[i], NULL);
    }

    // Aggregate the counts from all threads
    uint64_t total_count = 0;
    for (int i = 0; i < workers; i++) {
        total_count += (uint64_t) counts[i].count;
    }

    return total_count;
}

// Function to format a number with commas
void format_with_commas(uint64_t num, char *buffer, size_t size) {
    char temp[32];
    snprintf(temp, sizeof(temp), "%lu", num);

    int len = strlen(temp);
    int commas = (len - 1) / 3; // Number of commas to insert
    int output_len = len + commas;

    if (output_len >= size) {
        // Ensure the buffer is large enough
        buffer[0] = '\0';
        return;
    }

    int input_index = len - 1;
    int output_index = output_len;

    buffer[output_index--] = '\0'; // Null-terminate the string
    int group = 0;

    while (input_index >= 0) {
        buffer[output_index--] = temp[input_index--];
        if (++group == 3 && input_index >= 0) {
            buffer[output_index--] = ',';
            group = 0;
        }
    }
}

uint64_t test_single(int iter, int seconds) {
    uint64_t counter = 0;
    time_t start_time = time(NULL);

    // Loop for 1 second
    while (time(NULL) - start_time < 1) {
        counter++;
    }

	return counter;
}

int main() {

	for ( int i = 0; i < 3; i ++ ) {
		char formatted[32];
		uint64_t counter = test_single(i, 1);

		format_with_commas(counter, formatted, sizeof(formatted));
		printf("%d. - test_single(%d, %d): %s\n", i, 1, i, formatted);

	}
	
	for ( int i = 0; i < 12; i += 2 ) {
		char formatted[32];
		uint64_t counter = test_multi(i + 2 * 2, 1);

		format_with_commas(counter, formatted, sizeof(formatted));
		printf("%d. - test_multi(%d, %d): %s\n", i, i + 2, 1, formatted);

	}
	
	for ( int i = 0; i < 1; i += 2 ) {
		char formatted[32];
		uint64_t counter = test_multi(100, 1);

		format_with_commas(counter, formatted, sizeof(formatted));
		printf("%d. - test_multi(%d, %d): %s\n", i, 100, 1, formatted);

	}
	
	for ( int i = 0; i < 1; i += 2 ) {
		char formatted[32];
		uint64_t counter = test_multi(1000, 1);

		format_with_commas(counter, formatted, sizeof(formatted));
		printf("%d. - test_multi(%d, %d): %s\n", i, 1000, 1, formatted);

	}

    return 0;
}

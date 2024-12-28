import time
import threading
from concurrent.futures import ThreadPoolExecutor

def test_single(iter=0, seconds=1):
    start_time = time.time()
    count = 0

    while time.time() - start_time < seconds:
        count += 1

    print(f"{iter}. test_single({iter}, {seconds}) -> {count:,}")

def worker(seconds, result_list, index):
    end_time = time.time() + seconds
    count = 0

    while time.time() < end_time:
        count += 1

    result_list[index] = count

def test_multi(iter=0, seconds=1, workers=1):
    counts = [0] * workers
    threads = []

    for w in range(workers):
        thread = threading.Thread(target=worker, args=(seconds, counts, w))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    total_count = sum(counts)
    print(f"{iter}. test_multi({iter}, {seconds}, {workers}) -> {total_count:,}")
    return total_count

# Example usage
if __name__ == "__main__":
    print("Using time.time()")
    for i in range(3):
        test_single(i, 1)

    print("Workers")
    for i in range(1):
        test_multi(1, 1, 4)  # Example: iter=1, seconds=1, workers=4
    for i in range(1):
        test_multi(1, 1, 8)  # Example: iter=1, seconds=1, workers=8
    for i in range(1):
        test_multi(1, 1, 100)  # Example: iter=1, seconds=1, workers=100
    for i in range(1):
        test_multi(1, 1, 1000)  # Example: iter=1, seconds=1, workers=1000

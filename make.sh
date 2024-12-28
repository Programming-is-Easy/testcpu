#!/bin/sh 
#
# These are the gcc flags I used to get the best performance out of the C version.
# I have not tested this to see if these flags are even doing anything useful. 
#
# I should test that too. Ok. All the flags are isolated. Have fun!

gcc -o bin/testcpu_unoptimized langs/c/testcpu.c
gcc -o bin/testcpu_O3 -O3 langs/c/testcpu.c
gcc -o bin/testcpu_unroll -funroll-loops langs/c/testcpu.c
gcc -o bin/testcpu_fastmath -ffast-math langs/c/testcpu.c
gcc -o bin/testcpu_omit_frame_pointer -fomit-frame-pointer langs/c/testcpu.c

gcc -o bin/testcpu langs/c/testcpu.c -O3 -march=native -flto -funroll-loops -ffast-math -fomit-frame-pointer

go build -o bin/go_testcpu langs/go/main.go

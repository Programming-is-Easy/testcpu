#!/bin/sh 
#
# These are the gcc flags I used to get the best performance out of the C version.
# I have not tested this to see if these flags are even doing anything useful. 
#
# I should test that too. Ok. All the flags are isolated. Have fun!

gcc -o testcpu_unoptimized testcpu.c
gcc -o testcpu_O3 -O3 testcpu.c
gcc -o testcpu_unroll -funroll-loops testcpu.c
gcc -o testcpu_fastmath -ffast-math testcpu.c
gcc -o testcpu_omit_frame_pointer -fomit-frame-pointer testcpu.c

gcc -o testcpu testcpu.c -O3 -march=native -flto -funroll-loops -ffast-math -fomit-frame-pointer

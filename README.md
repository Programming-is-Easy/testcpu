# testcpu
A bunch of separate tests of CPU performance by language - golang, c, php, js, and python (lol).  

## Compile Everything
Make.sh is a simple script that will compile all the compilables 
and dump them into `bin/`. 
```console
$ chmod +x make.sh
$ ./make.sh
$ cd bin/ 
```
## Go Usage:
```console
$ go run langs/go/main.go
```
![image](https://github.com/user-attachments/assets/c3ab3cd8-1e8d-44f7-bd88-1a065bee69c9)
## C Usage:
```console
$ chmod +x make.sh
$ ./make.sh
$ ./testcpu
```
![image](https://github.com/user-attachments/assets/da4647b4-a7b4-4e07-95ce-44d37a72f4c1)
## Python Usage:
```console
$ python3 langs/python/testcpu.py
```
![image](https://github.com/user-attachments/assets/123edef2-2863-4c36-90e9-8361aa3dc159)
## Node Usage:
```console
$ node langs/js/testcpu.js
```
![image](https://github.com/user-attachments/assets/7d440d7b-e96c-4ad9-baa0-51522b669feb)
## Bun Usage:
```console
$ bun langs/js/testcpu.js
```
![image](https://github.com/user-attachments/assets/931494c7-319a-43b6-8a21-7f279eea8051)
## PHP Usage:
This one sucks. 
1. First go recompile PHP to have threads: https://stackoverflow.com/questions/67246761/how-to-compile-install-official-php-8-with-zts-ubuntu
2. Install parallel: https://github.com/krakjoe/parallel
3. Fight with your PHP config until it works:
- 1. Make sure you have a PHP ini set in your cli: `php --ini`
- 2. If not, find your PHP ini somewhere on your computer and put it into whatever Path `php --ini` says it's looking for.
- 3. Then edit that ini file and make sure you add `extension=/path/to/parallel.so`
4. Profit?
```console
$ php langs/php/testcpu.php
```
![image](https://github.com/user-attachments/assets/002aa2ca-ccc4-49df-bb12-6e3fbc585b2a)
## Additional Languages or Concepts
Feel free to submit a PR if you want to add a new language or point out some flaw in how I implemented the test in the versions that I've created. This isn't a "serious" benchmark, but if there's a better way to do something in a language in this repo, it'd be nice to see how that compares to the versions I've written. 

## Original X writeup:
https://x.com/blister/status/1873054737681305828

## I'm Eric Harrison!
Follow me if you want: https://x.com/blister

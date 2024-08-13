## TJ Computer Team Coderunner

TJ Computer Team Members: You can find all information about in-houses and the club here: https://activities.tjhsst.edu/ict/.
This grader website can be accessed at https://tjctgrader.org/.
Please contact us through tjctgrader@gmail.com if you have any questions or concerns.

This repository contains the part of the website that runs code and judges it. The component that deals with how pages are rendered to users can be found at this repository: https://github.com/ChiMasterBing/autograder.

### Getting Started

The routes folder contains the majority of the important code and the subcode folder contains C++, Java, and Python files that the server will write to, execute, and check the results of.
The problems are stored in a separate directory than this repository and each problem has a folder containing a checker ("code" file), input ("test" folder), and correct output ("sol" folder).
Here is an overview of the file structure:
```
├── coderunner
│   ├── app.js
│   ├── node_modules
│   ├── nsjail
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── runCode.js
│   │   └── sql.js
│   └── subcode
│       ├── a.out
│       ├── args.txt
│       ├── hello.py
│       ├── output.txt
│       ├── test.class
│       ├── test.cpp
│       └── test.java
└── problems
    ├── 1
    │   ├── code
    │   ├── sol
    │   │   ├── 0
    │   │   ├── 1
    │   │   ├── 2
    │   └── test
    │       ├── 0
    │       ├── 1
    │       └── 2
    ├── 2
    │   ├── code
    │   ├── sol
    │   │   ├── 0
    │   │   ├── 1
    │   └── test
    │       ├── 0
    │       └── 1
```

To run this locally, download the files, install Node.js, and install the necessary programs packages. Then, run:
```node app.js```.

The coderunner communicates with backend via GCloud internal IP addresses. All GCloud workings are important but are only accessible by CT Officers. To do local testing, one option is to keep coderunner and backend in the same "website," using POST request to pseudo-communicate across the two.

---

Current Developers: Gabriel Xu, Peter Kisselev, Andrew Chen

2023-2024 Developers: Johnny Liu, Daniel Qiu, Gabriel Xu

2022-2023 Developers: Johnny Liu, Daniel Qiu

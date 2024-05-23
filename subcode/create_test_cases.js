const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const NUM_TEST_CASES = 10; //number of testcases to generate
const GENERATOR_FILE = 'generator.py';
const SOLUTION_FILE = 'solution.py';
const TEST_CASE_DIR = 'test_cases';

if(!fs.existsSync(TEST_CASE_DIR)) {
  fs.mkdirSync(TEST_CASE_DIR);
}

function execCommand(command) {
  return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}

async function createTestCases() {
    for (let i = 1; i <= NUM_TEST_CASES; i++) {
        try {
            const input = await execCommand(`python3 ${GENERATOR_FILE}`);
            const inputFilePath = path.join(TEST_CASE_DIR, `input${i}.txt`);
            fs.writeFileSync(inputFilePath, input);

            const output = await execCommand(`echo "${input}" | python3 ${SOLUTION_FILE}`);
            const outputFilePath = path.join(TEST_CASE_DIR, `output${i}.txt`);
            fs.writeFileSync(outputFilePath, output);

            console.log(`Test case ${i} created successfully.`);
        } catch (error) {
            console.error(`Error creating test case ${i}:`, error);
        }
    }
}

createTestCases();

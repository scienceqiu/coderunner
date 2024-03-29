const execSync = require('child_process').execSync;
const fs = require('fs');
const {add, testSql} = require("./sql");

const axios = require('axios');
async function addTests(pid, tid, test, out){
        console.log("INTERESTING");
        let loc = "../problems/"+pid;
        console.log(pid, tid, test, out);
        console.log("here is loc");
        console.log(loc);
        if (!fs.existsSync(loc+pid)){
                fs.mkdirSync(loc+"/sol", { recursive: true });
        }
        if (!fs.existsSync(loc+pid)){
                fs.mkdirSync(loc+"/test", { recursive: true });
        }
        fs.writeFileSync(loc+"/test/"+tid, test);
	fs.writeFileSync(loc+"/sol/"+tid, out);
}
async function addChecker(pid, code){
        console.log("INTERESTING");
        let loc = "../problems/"+pid;
        console.log(pid, code)
        console.log("here is loc");
        console.log(loc);
        if (!fs.existsSync(loc+pid)){
                fs.mkdirSync(loc+"/sol", { recursive: true });
        }
        if (!fs.existsSync(loc+pid)){
                fs.mkdirSync(loc+"/test", { recursive: true });
        }
        fs.writeFileSync(loc+"/code", code);
}
async function runCode(input_file, lang, solution, checker=false){
        let output = ''
        console.log(lang);
	let start = 0;
	let end = -1;
        if (lang== 'cpp') {
                fs.writeFileSync('subcode/test.cpp', solution);
                //write to correct file for code
                try {
                        str = 'sudo ./nsjail/nsjail --config nsjail/configs/executable.cfg < '+input_file
                        output = execSync("g++ -o subcode/a.out subcode/test.cpp", { encoding: 'utf-8' });
                        start = performance.now();
			output = execSync(str, { encoding: 'utf-8' });
			end = performance.now();
                }
                catch (error) {
                        console.log("ERROR", error);
			payload = {
				output: error['stderr'],
				time: -1
			}
			return payload;
                }
                console.log("output was", output);
        }
        else if (lang== 'python') {
                console.log("running python\n" + solution);
                fs.writeFileSync('subcode/hello.py', solution);
                try {
			str = 'sudo ./nsjail/nsjail --config nsjail/configs/python.cfg < '+input_file
			if(checker){
				str = 'sudo ./nsjail/nsjail --config nsjail/configs/pythonchecker.cfg < '+input_file
			}
                        start = performance.now();
			output = execSync(str, { encoding: 'utf-8' });
                	end = performance.now();
		}
                catch (error) {
                        console.log("ERROR", error);
			payload = {
				output: error['stderr'],
				time: -1
			}
			return payload;
                }
                console.log("output was", output);
        }
        else if (lang== 'java') {
                fs.writeFileSync('subcode/test.java', solution);
                try {
                        str = 'sudo ./nsjail/nsjail --config nsjail/configs/java.cfg < '+input_file
                        output = execSync("javac subcode/test.java", { encoding: 'utf-8' });
                        start = performance.now()+900;
			output = execSync(str, { encoding: 'utf-8' });
                	end = performance.now();
		}
                catch (error) {
                        console.log("ERROR", error);
			payload = {
				output: error['stderr'],
				time: -1
			}
			return payload;
                }
                console.log("output was", output);
        }
	rt = end-start;
	payload = {
		output: output,
		time: parseInt(rt)
	}
	console.log(end, start, rt);
        return payload;
}
async function compileTests(problem){
        let loc = "../problems/"+problem.id;
        console.log(problem.id);
        console.log(problem);
        fs.readdir(loc, (err, files)=> {
                for(i in files){
                        fs.writeFileSync(loc+"/sol/"+i, runCode(i, problem.lang, code).output);
                }
        });
}

async function run(problem, submit) {

        let loc = "/home/tjctgrader/problems/"+problem.id+"/test/";
        let loc2 = "/home/tjctgrader/problems/"+problem.id+"/code";
        let checkid = problem.checkid;
        let tl = problem.tl;
        let ml = problem.ml;
        let userCode = submit.code;
        let language = submit.language;

        return new Promise ((res, rej) => {
	let payload = {
		verdict: "ER",
		output: undefined
	}

	let output = undefined;
	let maxtime = -1;
	try{
		checkerCode = fs.readFileSync(loc2, {encoding:'utf8', flag:'r'})
	}catch(error){
		console.log("error :", error);
		payload.verdict = "ERROR"
		payload.output = "Problem ID not found"
		res(payload)
	}
        console.log(checkerCode);
        console.log(loc);
	let solved = true;

        fs.readdir(loc, async (err, files)=> {
		if(err){
			console.log(err)
			return;
		}
		let testnum = 0;
		console.log(files)
                for(_ in files){
			i = files[_]
                        console.log(loc+i);
                        outputfull = await runCode(loc+i, language, userCode)
                        output = outputfull.output;
			if (outputfull.time > maxtime) maxtime = outputfull.time;
			if(outputfull.time==-1){
				solved = false;
				payload.verdict = "Compilation Error"
				if(output.includes("run time >= time limit")){
					payload.verdict = "TLE"
				}else if(output.includes("MemoryError")||output.includes("SIGSEGV")||output.includes("StackOverflowError")){
					payload.verdict = "MLE"
				}
				payload.tl = maxtime
				output = output.replace(/^\[I\].*/gm, '');
				output = output.trim()
				payload.output = output
				console.log("error in compiliation.")
				res(payload);
				break;
			}
			fs.writeFileSync("subcode/output.txt", output)
                        fs.writeFileSync("subcode/args.txt", problem.id+" "+i)
                        console.log("output was", output)
                        juryAnswer = await runCode("subcode/args.txt", "python", checkerCode, true);
  			juryAnswer = juryAnswer.output;
                        console.log("jury answer was", juryAnswer)
			console.log(maxtime, outputfull.time);
		

                        if(!(juryAnswer.trim() === "AC")){
                                console.log("Wrong answer - terminating...")
				payload.verdict = "WA";
				if (testnum < 1) {
					payload.output = "Test " + testnum + "\n" + juryAnswer;
				}
				else {
					payload.output = "DISABLED [Please contact Admin if you can view this not as Admin]\n\n Test " + testnum + "\n" + juryAnswer;
				}
				payload.tl = maxtime;
                                solved = false;
				res(payload);
				break;
                        }
			testnum += 1;
                }
		if (solved) {
			payload.verdict = "AC";
			payload.tl = maxtime;
			payload.output = "All cases correct - no additional feedback."
                	console.log("Solved.")
                	res(payload);
		}
        });
        });

}
async function addProblem(pid, tl, ml, checker){
        let loc = "../problems/"+pid;
        fs.writeFileSync(loc+"/checker.cpp", checker);
        add(pid, tl, ml);
}

module.exports = {
        run: (problem, submit) => {
                return run(problem, submit);
        },
        compileTests: (problem) => {
                return compileTests(problem);
        },
        addTests: (problem, tid, test, out) => {
                return addTests(problem, tid, test, out);
        },
        addChecker: (pid, code) => {
                return addChecker(pid, code);
        }
}

var shell = require('shelljs');
const path = require('path')
const process = require('process');

const { exec, spawn } = require('child_process');

exports.start = function(pwd){

	// process.execPath = __dirname;
	
	// console.log(process.execPath);

	// console.log(pwd);

	// shell.exec("ipconfig")

	// exec('peer_root.exe init', (err, stdout, stderr) => {
	//   if (err) {
	//     console.error(err);
	//     return;
	//   }
	//   console.log(stdout);
	// });


	// shell.cd(__dirname);
	// console.log(shell.which("./peer_root.exe"));
	// shell.exec("./peer_root.exe init",{async:true});

	// console.log("end");
	// console.log(shell.which("git"));
	// shell.exec("./peer_root.exe init");
	// console.log(code);

//即同步运行外部工具
// if (shell.exec("./peer_root.exe init").code !== 0){
//     shell.echo('Error: Git commit failed');
//     shell.exit(1);
// }





	// 异步运行扩展工具
	// if (shell.exec("ipconfig").code === 0) {
	// 	console.log("peer_root.exe init");
	// }
}

// module.exports = class Shell {
// 	start(pwd){
// 		console.log(pwd);
// 		// 异步运行扩展工具
// 		if (shell.exec('peer_root.exe init').code == 0) {
// 			console.log("peer_root.exe init");
// 		}
// 	}

//   constructor(width) {
//     this.width = width;
//   }

//   area() {
//     return this.width ** 2;
//   }
// };

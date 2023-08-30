const {dirFileList} = require("../dirFileList.js")
const fs = require("fs")
const path = require("path")

// Copies files from one place to another, the directory structure in the destination
// must be present

const javascriptFiles = [".js", ".mjs", ".cjs", ".jsx", ".ts"]
const textFiles = [".txt"]

;(async function () {
	await copyFiles("E:", "E:\\", "G:\\My Drive\\", textFiles, [
		"node_modules",
		".git",
	]).catch((err) => console.log(err))
})()

async function copyFiles(sourceDrive, source, destination, ext, excludeDirs) {
	let arrDirListChecked = []
	let arrDirDoesntExist = []

	let result = await dirFileList(source, ext, {
		recursive: true,
		exclude_directories: excludeDirs,
	})

	result.forEach((file, i) => {
		let newDir = result[i].dir.replace(sourceDrive, destination)

		if (arrDirListChecked.includes(newDir)) {
			if (!arrDirDoesntExist.includes(newDir)) {
				// copy
				copyFile(
					file.filepath,
					path.join(newDir, file.filename),
					() => {}
				)
			}
		} else {
			//check if the dir exists
			if (fs.existsSync(newDir)) {
				arrDirListChecked.push(newDir)
				// copy
				copyFile(
					file.filepath,
					path.join(newDir, file.filename),
					() => {}
				)
			} else {
				if (!arrDirDoesntExist.includes(newDir)) {
					arrDirDoesntExist.push(newDir)
					console.log("Error - " + newDir + " doesn't exist")
					errorLog(newDir)
				}
			}
		}
	})
}

function copyFile(source, target, cb) {
	var cbCalled = false

	var rd = fs.createReadStream(source)
	rd.on("error", done)

	var wr = fs.createWriteStream(target)
	wr.on("error", done)
	wr.on("close", function (ex) {
		done()
	})
	rd.pipe(wr)

	function done(err) {
		if (!cbCalled) {
			cb(err)
			cbCalled = true
		}
	}
}

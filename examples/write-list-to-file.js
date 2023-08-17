// Usage: node ./examples/write-list-to-file.js "/home" ".txt"
const {dirFileList} = require("../src/dirFileList.js")
const fs = require("fs")
const process = require("process")
const path = require("path")

;(async function () {
	let rootDir = process.argv[2]

	let toString = Object.prototype.toString

	if (toString.call(process.argv[3]) !== "[object String]") {
		console.log("extensions is wrong type. It should be String")
		return 0
	}

	let ext = [process.argv[3]]

	let result = await dirFileList(rootDir, ext, {
		recursive: true,
		exclude_directories: ["node_modules", ".git", "archive"],
	}).catch((err) => {
		console.log(err)
	})

	// Write to a file
	fs.writeFileSync(
		path.join("dist", "output.json"),
		JSON.stringify(result, null, 2),
		(err) => {
			if (err) {
				console.log("Error")
				console.error(err)
			} else {
				console.log("File successfully written!")
			}
		}
	)
})()

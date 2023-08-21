const {dirFileList} = require("../src/dirFileList.js")
const process = require("process")

;(async function () {
	// all text files in /test/one
	let result = await dirFileList("test/one", [".txt"], {
		recursive: true,
	}).catch((err) => console.log(err))

	console.log("Size", "Modified Date", "Filepath")
	result.map((file) => {
		let {size, modified_time, filepath} = file
		console.log(size, new Date(modified_time), filepath)
	})
	// Size Modified Date Filepath
	// 0 2023-08-20T06:56:14.221Z C:\Github-Repos\directory-file-list\test\one\1.txt
	// 0 2023-08-20T06:56:27.322Z C:\Github-Repos\directory-file-list\test\one\one-one\11.txt

	// no recursion on /test
	let result2 = await dirFileList("test", [], {
		recursive: false,
	}).catch((err) => console.log(err))

	console.log("Size", "Modified Date", "Filepath")
	result2.map((file) => {
		let {size, modified_time, filepath} = file
		console.log(size, new Date(modified_time), filepath)
	})
	// Size Modified Date Filepath
	// 0 2023-08-20T10:07:00.631Z C:\Github-Repos\directory-file-list\test\test.md
	// 0 2023-08-20T10:06:45.989Z C:\Github-Repos\directory-file-list\test\test.txt

	// find all files in /test/four
	let result3 = await dirFileList("test/four", []).catch((err) =>
		console.log(err)
	)

	console.log("Size", "Modified Date", "Filepath")
	result3.map((file) => {
		let {size, modified_time, filepath} = file
		console.log(size, new Date(modified_time), filepath)
	})
	// Size Modified Date Filepath
	// 0 2023-08-20T06:58:40.916Z C:\Github-Repos\directory-file-list\test\four\4.txt
	// 0 2023-08-20T06:58:45.693Z C:\Github-Repos\directory-file-list\test\four\four-four\41.txt
	// 0 2023-08-20T06:58:46.883Z C:\Github-Repos\directory-file-list\test\four\four-four\42.txt
	// 0 2023-08-20T06:58:47.692Z C:\Github-Repos\directory-file-list\four\four-four\43.txt
	// 0 2023-08-20T06:58:48.389Z C:\Github-Repos\directory-file-list\test\four\four-four\44.txt
	// 0 2023-08-20T06:59:07.117Z C:\Github-Repos\directory-file-list\test\four\four-one\41.txt
	// 0 2023-08-20T06:59:13.616Z C:\Github-Repos\directory-file-list\test\four\four-three\41.txt
	// 0 2023-08-20T06:59:16.767Z C:\Github-Repos\directory-file-list\test\four\four-three\42.txt
	// 0 2023-08-20T06:59:18.668Z C:\Github-Repos\directory-file-list\test\four\four-three\43.txt
	// 0 2023-08-20T06:59:23.022Z C:\Github-Repos\directory-file-list\test\four\four-two\41.txt
	// 0 2023-08-20T06:59:23.022Z C:\Github-Repos\directory-file-list\test\four\four-two\42.txt
})()

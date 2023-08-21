const fs = require("node:fs/promises")
const st = require("node:fs/promises")
const path = require("path")

async function dirFileList(rootPath, extensions, options = {}) {
	// ^INITIALIZE
	let settings = options || {}
	settings.extensions = extensions ?? []
	settings.recursive = settings.recursive ?? true
	settings.exclude_filenames = options.exclude_filenames ?? []
	settings.exclude_directories = options.exclude_directories ?? []
	settings.max_depth = settings.max_depth ?? 15

	let toString = Object.prototype.toString
	if (toString.call(settings.extensions) !== "[object Array]") {
		return Promise.reject("extensions is wrong type. It should be Array")
	}
	if (toString.call(settings.recursive) !== "[object Boolean]") {
		return Promise.reject("recursive is wrong type. It should be Boolean")
	}
	if (toString.call(settings.exclude_filenames) !== "[object Array]") {
		return Promise.reject(
			"exclude_filenames is wrong type. It should be Array"
		)
	}
	if (toString.call(settings.exclude_directories) !== "[object Array]") {
		return Promise.reject(
			"exclude_directories is wrong type. It should be Array"
		)
	}
	if (toString.call(settings.max_depth) !== "[object Number]") {
		return Promise.reject("max_depth is wrong type. It should be Number")
	}

	let fileList = await filesDirs(rootPath, rootPath, 1, settings)

	// filter out extensions
	let extList = []
	if (settings.extensions.length) {
		extList = fileList.filter((file) => {
			return settings.extensions.includes(file.extension)
		})
	} else {
		extList = fileList
	}

	return extList
}

async function filesDirs(rootPath, currentPath, depth, settings) {
	let arrResult = []

	// if this current directory is in the exclude_directories list, return
	if (settings.exclude_directories.includes(path.basename(currentPath)))
		return arrResult

	let dirList = await getDirectoryList(currentPath)

	// filter out exclude_filenames
	let afterExclFiles = []

	if (settings.exclude_filenames.length) {
		afterExclFiles = dirList.filter(
			(file) => settings.exclude_filenames.includes(file) === false
		)
	} else {
		afterExclFiles = dirList
	}

	let arrFileStatsPromises = afterExclFiles.map((cv) =>
		getFileStatsWrapper(currentPath, cv, rootPath, depth)
	)

	let arrFileStats = await Promise.all(arrFileStatsPromises).catch((err) => {
		console.log(err)
	})

	let arrFileStatsNeeded = arrFileStats.map((cv, i) => {
		let f
		try {
			f = cv.isFile()
		} catch {
			f = {}
		}

		return {
			...getFileStatsNeeded(
				cv,
				depth,
				path.resolve(path.join(currentPath, afterExclFiles[i])),
				rootPath
			),
			filepath: path.resolve(path.join(currentPath, afterExclFiles[i])),
			file: f,
		}
	})

	const files = arrFileStatsNeeded.filter((item) => item.file)
	const dirs = arrFileStatsNeeded.filter((item) => !item.file)

	files.forEach((cv) => arrResult.push(cv))

	let filesListDirs = []
	if (dirs.length) {
		if (settings.recursive) {
			if (settings.max_depth > depth) {
				filesListDirs = dirs.map((dir) =>
					filesDirs(rootPath, dir.filepath, depth + 1, settings)
				)
			}
		}
	} else {
		return arrResult
	}

	let subdirs = await Promise.all(filesListDirs)
	subdirs.flat().forEach((cv) => arrResult.push(cv))

	return arrResult
}

function getDirectoryList(directory) {
	return new Promise((resolve, reject) => {
		let f = fs.readdir(directory, function (err, filenames) {
			if (err) {
				reject(err)
			}
		})
		resolve(f)
	})
}

function getFileStatsNeeded(filestats, depth, filepath, rootPath) {
	return {
		size: filestats.size,
		mode: filestats.mode,
		access_time: filestats.atimeMs,
		modified_time: filestats.mtimeMs,
		status_change_time: filestats.ctimeMs,
		birthtime: filestats.birthtimeMs,
		depth,
		filename: path.basename(filepath),
		relative: filepath.replace(path.resolve(rootPath) + "\\", ""),
		dir: path.dirname(filepath),
		extension: path.extname(filepath),
		isFile: filestats.isFile(),
	}
}

function getFileStats(file) {
	return new Promise(async (resolve, reject) => {
		let f = st.stat(file, (err) => {
			reject(err)
		})
		resolve(f)
	})
}

// If the filesystem can't return stat,
// return an simple object
// To avoid Promise.all failing
async function getFileStatsWrapper(currentPath, filename, rootPath, depth) {
	let r = await getFileStats(path.join(currentPath, filename))
		.then((result) => result)
		.catch((err) => {
			return {
				filename,
				depth,
				filepath: path.join(currentPath, filename),
				dir: currentPath,
			}
		})

	return r
}

module.exports = {dirFileList, getDirectoryList}

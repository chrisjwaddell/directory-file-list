const fs = require('node:fs/promises');
const st = require('node:fs/promises');
const path = require("path")
const process = require("process")


async function dirFileList(rootPath, extensions, options) {
    // ^INITIALIZE
    console.log("dirFileList top")
	let settings = options || {}
	settings.recursive = settings.recursive ?? true
    settings.exclude_filenames = options.exclude_filenames ?? []
    settings.exclude_directories = options.exclude_directories ?? []
    settings.max_depth = settings.max_depth ?? 15

    console.log(settings.exclude_filenames)

    let fileList = await filesDirs(rootPath, rootPath, 1, settings)

    // filter out extensions
    let extList = []
    if (extensions.length) {
        extList = fileList.filter(file => extensions.includes(file.extension) )
    } else {
        extList = fileList
    }

    // filter out exclude_filenames
    let afterExclFiles = []
    if (options.exclude_filenames.length) {
        afterExclFiles = extList.filter(file => !options.exclude_filenames.includes(file.filename) )
    } else {
        afterExclFiles = extList
    }

    return afterExclFiles
}


async function filesDirs(rootPath, currentPath, depth, settings) {

    let arrResult = []

    // if this current directory is in the exclude_directories list, return
    if (settings.exclude_directories.includes(path.basename(currentPath))) return arrResult

    let a = await getDirectoryList(currentPath)

    console.log("filesDirs(" + currentPath + ")")

    let arrFileStatsPromises = a.map(cv => getFileStats(currentPath + "\\" + cv))

    let arrFileStats = await Promise.all(arrFileStatsPromises)

    let arrFileStatsNeeded = arrFileStats.map((cv, i) => {
        return { ...getFileStatsNeeded(cv, depth, currentPath + "\\" + a[i], rootPath), filepath: currentPath + "\\" + a[i], file: cv.isFile() }
    })

    const files = arrFileStatsNeeded.filter(item => item.file)
    const dirs = arrFileStatsNeeded.filter(item => !item.file)

    files.forEach(cv => arrResult.push(cv))

    let filesListDirs = []
    if (dirs.length) {

        if (settings.recursive) {
            if (settings.max_depth > depth) {
                filesListDirs = dirs.map(dir => filesDirs(rootPath, dir.filepath, depth + 1, settings))
            }
        }
    } else {
        return arrResult
    }


    let subdirs = await Promise.all(filesListDirs)
    subdirs.flat().forEach(cv => arrResult.push(cv))

    return arrResult
}



function getDirectoryList( directory ) {
    return new Promise((resolve, reject) => {
        let f = fs.readdir(
            directory,
            function ( err, filenames ) {
                if (err) {
                    reject( err )
                }
            }
        )
        resolve( f )
    })
}


function getFileStatsNeeded(filestats, depth, filepath, rootPath) {
    return { size: filestats.size, mode: filestats.mode, access_time: filestats.atime, modified_time: filestats.mtime, status_change_time: filestats.ctime, birthtime: filestats.birthtime, depth, filename: path.basename(filepath), relative: filepath.replace(rootPath + "\\", ""), extension: path.extname(filepath) }
}


function getFileStats(file) {
    return new Promise(async (resolve, reject) => {
        let f = st.stat(
            file,
            ( err ) => {
                reject( err )
            }
        )

        resolve( f )
    })
}




module.exports = dirFileList

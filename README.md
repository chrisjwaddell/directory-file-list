# DIRECTORY-FILE-LIST

Directory-File-list returns an array of files in a directory matching the extension criteria you give it. It returns a promise.

It returns an array of file statistics in an object:
``
[
  {
    "size": 23,
    "mode": 33206,
    "access_time": "2023-08-17T13:20:11.615Z",
    "modified_time": "2023-08-13T11:06:17.298Z",
    "status_change_time": "2023-08-13T11:06:17.298Z",
    "birthtime": "2023-08-08T17:51:04.326Z",
    "depth": 1,
    "filename": "README.md",
    "relative": "README.md",
    "dir": "E:\\directory-file-list",
    "extension": ".md",
    "filepath": "E:\\directory-file-list\\README.md",
    "file": true
  }
]
``



Supply it with a root directory and an array of file extensions.

``
const { dirFileList } = require("../src/dirFileList.js");

const textFiles = [ ".txt", ".md" ]

;(async function () {
    let result = await dirFileList("E:\", textFiles, {recursive: true, exclude_directories: [ "node_modules", ".git", "archive" ] })
    .catch(err => {
        console.log(err)
    })

    // Write to a file
    fs.writeFileSync(path.join("dist", "output.json"), JSON.stringify(result, null, 2), err => {
        if (err) {
            console.log("Error")
            console.error(err)
        } else {
            console.log("File successfully written!")
        }
    })

})()
``



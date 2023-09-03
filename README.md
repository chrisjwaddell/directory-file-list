# DIRECTORY-FILE-LIST

Directory-file-list returns an array of files and directories with Stats file properties in a directory matching the file extension criteria you give it. It returns a promise.
Directory-file-list recursively goes through all sub-directories from the root directory and puts each file property into an object and returns an array of these file object properties.

It returns an array of file properties in an object:
```
[
  {
    "size": 23,
    "mode": 33206,
    "access_time": 1692374000010.5752,
    "modified_time": 1692373765580.4746,
    "status_change_time": 1692373765580.4746,
    "birthtime": 1691517064325.588,
    "depth": 1,
    "filename": "README.md",
    "relative": "README.md",
    "dir": "E:\\directory-file-list",
    "extension": ".md",
    "filepath": "E:\\directory-file-list\\README.md",
    "isFile": true
  }
]
```

Supply _directory-file-list_ with a root directory and an array of file extensions.

```
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
```



_Directory-file-list_ takes three arguments:
<br>
_rootPath, extensions_ and _options_


## rootPath
The root directory you want to search from.

## extensions
An array of file extensions. An empty array meaning all extensions. It must be exact ie dot infront.
eg
<br>
``
[ ".txt", ".pdf" ]
``

``
const javascriptFiles = [ ".js", ".mjs", ".cjs", ".jsx", ".ts" ]
const textFiles = [ ".txt", ".cvs" ]
``

For ideas of file extension groups see [Wikipedia](https://en.wikipedia.org/wiki/List_of_file_formats)



## Options

### recursive
The default is true.


### exclude_files
An array of file names to exclude. The results will exclude any files that match these exact file names at all directory depths. Just a filename with a file extension, no directory path name. Eg
``
[ ".gitignore", "package.json" ]
``

### exclude_directories
An array of directories to exclude. Not a path. The results will exclude any directories that match these exact directory names at all directory depths.
_node-modules_, _bin_ and _dist_ are examples.
``
["node_modules", "bin", "dist" ]
``


### max_depth
Set a limit of how far you want to traverse down the directory list from the root directory. The default is 15.


Exclude files and directories by the above options. They apply to all levels. If you want to be more specific, it's better to do it with the returned results.

Order of files may depend on the operating system. If you a specific order of the files, you can do it to your specific needs.





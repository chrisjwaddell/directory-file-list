# DIRECTORY-FILE-LIST

Directory-File-list returns an array of files in a directory matching the extension criteria you give it.

Directory-File-list returns an array with a list of all file properties in a directory and also traverses each directory branch to return file properties such as size.

It returns a promise.


It returns an array of file statistics in an object:
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
    "file": true
  }
]
```



Supply it with a root directory and an array of file extensions.

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



dirFileList takes three arguments:
<br>
_rootPath, extensions_ and _options_


## rootPath
The root directory you want to search from.

## extensions
An array of file extensions. An empty array meaning all extensions. It must be exact ie dot infront.
eg 
``
[ ".txt", ".pdf" ]
``

const javascriptFiles = [ ".js", ".mjs", ".cjs", ".jsx", ".ts" ]
const textFiles = [ ".txt", ".cvs" ]

For ideas of file extension groups see [Wikipedia](https://en.wikipedia.org/wiki/List_of_file_formats)



## Options

### recursive
The default is true.


### exclude_files
Supply an array of file names. Not with a directory name in it, just file names, exact filename, you want to exclude at all depths. Just a filename with an extension.


### exclude_directories
Supply an array of directories. Not a path. It will exclude the exact directory name at all depths.
_node-modules_, _bin_ and _dist_ are examples.
``
["node_modules", "bin" ]
``


### max_depth
default is 15








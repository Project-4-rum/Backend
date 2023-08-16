const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const dbFilePath = path.join(__dirname, "../storage/DB/fileDB.json");

class File {
  constructor(uniquename, filename, size, uploadedby, tags = []) {
    this.id = uuidv4();
    this.uniquename = uniquename;
    this.filename = filename;
    // this.path = path;
    this.size = size;
    (this.uploadedby = uploadedby), (this.tags = tags);
    this.appendToDB();
  }

  appendToDB() {
    const fileData = {
      id: this.id,
      uniquename: this.uniquename,
      filename: this.filename,
      // path: this.path,
      size: this.size,
      uploadedby: this.uploadedby,
      tags: this.tags,
    };

    const jsonString = JSON.stringify(fileData, null, 2);

    console.log(dbFilePath);

    fs.readFile(dbFilePath, "utf-8", (err, data) => {
      let filesArray = [];
      if (!err && data.trim().length > 0) {
        filesArray = JSON.parse(data);
      }
      filesArray.push(fileData);
      // console.log(fileData);

      const jsonString = JSON.stringify(filesArray, null, 2);
      // console.log(`JSON __________________${jsonString}`);

      fs.writeFile(dbFilePath, jsonString + "\n", "utf-8", (err) => {
        if (err) {
          console.log({ error: `Unable to append to DB${err}` });
        } else {
          console.log({ success: "File has been added to the DB" });
        }
      });
    });
  }
}

function getFilesByFilename(filename, callback) {
  fs.readFile(dbFilePath, "utf-8", (err, data) => {
    if (err) {
      console.log({ error: `Error reading: ${err}` });
      console.error("ERROR", err);
      callback(null);
    } else {
      try {
        // const filesArray = JSON.parse(data.trim());
        const filesArray = data.trim().length > 0 ? JSON.parse(data) : [];

        const files = filesArray.filter((file) => {
          return (
            file.filename &&
            file.filename.toLowerCase().includes(filename.toLowerCase())
          );
          // return filename.toLowerCase().includes(filename.toLowerCase());
        });
        callback(files);
      } catch (parseErr) {
        console.log({ error: `Error parsing JSON: ${parseErr}` });
        callback(null);
      }
    }
  });
}

function getFilesByTag(tags, callback) {
  fs.readFile(dbFilePath, "utf-8", (err, data) => {
    if (err) {
      console.log({ error: `Error reading: ${err}` });
      console.error("ERROR", err);
      callback(null);
    } else {
      const filesArray = data.trim().length > 0 ? JSON.parse(data) : [];
      const files = filesArray
        // .map((jsonString) => JSON.parse(jsonString))
        .filter((file) => {
          return tags.some((tag) => file.tags.includes(tag));
        });
      callback(files);
    }
  });
}

// getFilesByFilename("bugs");
// const newFile = new File("testfile", "testfilename", 5000, "sandman", [
//   "test1",
//   "test2",
// ]);

module.exports = { File, getFilesByTag, getFilesByFilename };

const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

class File {
  constructor(filename, size, tags = []) {
    this.id = uuidv4();
    this.filename = filename;
    // this.path = path;
    this.size = size;
    this.tags = tags;
    this.appendToDB();
  }

  appendToDB() {
    const fileData = {
      id: this.id,
      filename: this.filename,
      // path: this.path,
      size: this.size,
      tags: this.tags,
    };

    const jsonString = JSON.stringify(fileData, null, 2);
    const dbFilePath = path.join(__dirname, "../storage/DB/fileDB.json");

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

function getFilesByTag(tags, callback) {
  fs.readFile("../storage/DB/fileDB.json", "utf-8", (err, data) => {
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

// const COA = new File("SA sir", 26, ["COA", "mam"]);
// getFilesByTag(["COA"], (result) => {
//   console.log(result);
// });

module.exports = { File, getFilesByTag };

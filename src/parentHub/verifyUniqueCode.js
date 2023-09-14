const fs = require('fs');
const filePath = './teacherEmailToUniqueCode.json';

// Function to read the map data from file
function readMapFromFile() {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const mapData = JSON.parse(fileContents);
      const map = new Map(mapData);
      return map;
    } catch (err) {
      return new Map();
    }
}
const teacherEmailToUniqueCode = readMapFromFile();
//Verify Unique Code

const isUniqueCodeValid = (code,associatedTeachersEmails) => {
    for(email of associatedTeachersEmails){
        if(teacherEmailToUniqueCode.get(email) === code){
            return true;
        }
    }
    return false;
}

module.exports = {
    isUniqueCodeValid
  };
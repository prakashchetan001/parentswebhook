const fs = require('fs');
const filePath = './teacherEmailToUniqueCode.json';
const {readMapFromFile, teachersFilePath} = require("./helpers/utils");

//Verify Unique Code
const isUniqueCodeValid = (code,associatedTeachersEmails) => {
    const teacherEmailToUniqueCode = readMapFromFile(teachersFilePath);
    
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
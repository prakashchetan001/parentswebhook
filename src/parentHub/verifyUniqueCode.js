const fs = require('fs');
const filePath = './teacherEmailToUniqueCode.json';
const {readMapFromFile} = require("./helpers/utils");

//Verify Unique Code
const isUniqueCodeValid = (code,associatedTeachersEmails) => {
    const teacherEmailToUniqueCode = readMapFromFile();
    
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
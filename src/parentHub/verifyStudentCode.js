const fs = require('fs');
const {studentCodeMapping} = require("./helpers/utils");

//Verify Unique Code
const isUniqueCodeValid = (studentEmail, code) => {

    return (studentCodeMapping.get(studentEmail) != null && studentCodeMapping.get(studentEmail) == code) ? true : false;
}

module.exports = {
    isUniqueCodeValid
}

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Define the file path
const teachersFilePath = './src/parentHub/data/teacherEmailToUniqueCode.json';
const studentCodeMapping = new Map();

// Function to read the map data from file
function readMapFromFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const mapData = JSON.parse(fileContents);
    const map = new Map(mapData);
    return map;
  } catch (err) {
    return new Map();
  }
}
  
// Function to write the map data to file
function writeMapToFile(map, filePath) {
  const mapData = Array.from(map.entries());
  const jsonData = JSON.stringify(mapData);
  fs.writeFileSync(filePath, jsonData);
}

  //Send Unique Code
function generateUniqueCode() {
  const uniqueCode =  uuidv4().substr(0, 4);             
  return uniqueCode;
}

function clearData() {
  studentCodeMapping.clear();
  fs.unlinkSync(teachersFilePath);
}

module.exports = {readMapFromFile, writeMapToFile, generateUniqueCode, teachersFilePath, studentCodeMapping, clearData};
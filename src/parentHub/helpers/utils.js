
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Define the file path
const filePath = './src/parentHub/data/teacherEmailToUniqueCode.json';

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
  
// Function to write the map data to file
function writeMapToFile(map) {
  const mapData = Array.from(map.entries());
  const jsonData = JSON.stringify(mapData);
  fs.writeFileSync(filePath, jsonData);
}

  //Send Unique Code
function generateUniqueCode() {
  const uniqueCode =  uuidv4().substr(0, 4);             
  return uniqueCode;
}

module.exports = {readMapFromFile, writeMapToFile, generateUniqueCode};
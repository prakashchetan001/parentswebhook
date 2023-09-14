// ./src/index.js
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const lib = require('./updateParentHelper');
const sendCode = require('./parentHub/sendUniqueCode.js');
const validateTeacherCode = require('./parentHub/verifyUniqueCode');
const relatedContacts = require('./parentHub/relatedContacts');
const classIdCommunityIdMap = {};

// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Hello, world (again)!'}
];

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});
var port = process.env.PORT || 3000;

// starting the server
app.listen(port, () => {
  console.log('listening on port '+port);
});

app.get('/test', (req, resp)=>{
    console.log("Test Parents api get", req.headers);
    resp.send("test endpoint")
});
app.post('/parents', (req, resp)=>{
    console.log("Parents endpoint Called");

    validationToken = req.query.validationToken
    if(validationToken){
      console.log("Inside Validation Token");
      resp.set('Content-Type', 'text/plain');
      resp.status(200).send(validationToken);
    } else {
      approvalId = req.body.value[0].id;
      // Check whether it is correct approval ID
      lib.processRequest(approvalId);
      resp.send("post endpoint");
    }
});

app.get('/list/communities',(req, res)=> {
  console.log("In List");
  console.log("get community Endpoint called: ", req.query.teamIds, typeof req.query.teamIds)
  let teamIds = undefined;
  if(req.query.teamIds && typeof req.query.teamIds === "string") {
      teamIds = req.query.teamIds.split(",");
  }
  if(!teamIds && !teamIds.length) {
    res.status(400).end();
  }
  console.log(classIdCommunityIdMap);
  const teamIdCummunityMap= teamIds.reduce((accumulator, teamId )=>{
    if(classIdCommunityIdMap.hasOwnProperty(teamId) && !accumulator.hasOwnProperty(teamId)){
      accumulator[teamId] = classIdCommunityIdMap[teamId];
    }
    return accumulator;
  }, {})
  res.send({teamIdCommunityMap: teamIdCummunityMap});
});

// Team ID -  Community Id for hack
app.post('/class/:teamId/community',(req, res)=> {
  console.log("Post community Endpoint called: ", req.params.teamId)
  console.log("communityId")
  const teamId = req.params.teamId;
  const communityId = req.body && req.body["communityId"];
  if(!teamId) {
        res.status(400).end();
  }
  if(!req.body || !req.body["communityId"]){
    res.status(400).end();
  }
  classIdCommunityIdMap[teamId] = communityId
  res.send("CommunityId Map updated")
});

/**
 * APIs for adding parents via school connection hack
 */

app.post('/sendTeacherCode', (req,resp)=>{
  const teacherEmails = req.body["teacherEmails"];
  console.log("Send Teacher Code endpoint Called with emails :", teacherEmails);
  sendCode.sendCodeToTeacher(teacherEmails);
  resp.status(200).send("Sent emails successfully");
});

app.post('/verifyUniqueCode', (req, resp)=>{
  const teacherEmails = req.body["teacherEmails"];
  const code = req.body["code"];
  
  console.log("Verify Unique Code endpoint Called with code : %s and teachers: %s", code, teacherEmails);
  
  const isCodeValid = validateTeacherCode.isUniqueCodeValid(code,teacherEmails);
  resp.send(isCodeValid);
});

app.post('/addParent',(req, res)=> {
  const studentId = req.body["studentId"];
  const parentEmail = req.body["parentEmail"];
  const parentName = req.body["parentName"];
  console.log("Add parent called with student %s and parent email %s", studentId, parentEmail);

  relatedContacts.updateRelatedContacts(studentId, parentEmail, parentName);

  res.status(200).send("Added parent successfully");
});

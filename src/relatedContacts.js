const axios = require('axios');
const { response } = require('express');
const qs = require('qs')

const updateRelatedContacts = async(studentId, parentName, parentEmail) => {
    const accessToken = await getAccessToken();
    const existingcontacts = await getRelatedContacts(accessToken, studentId);

    const relatedContacts = [].concat(existingcontacts);
    const newContact = {
        "displayName" : parentName,
        "emailAddress" : parentEmail,
        "relationship":"parent",
        "accessConsent": true
    };
    relatedContacts.push(newContact);

    url = `https://graph.microsoft.com/beta/education/users/${studentId}`;
    const body = {
        "relatedContacts": relatedContacts
    }

    resp = await axios
    .patch(url, body , {
        headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer ' + accessToken }
    });
    console.log("updated data successfully");
    return;
}

const getRelatedContacts = async(accessToken, studentId) => {
    url = `https://graph.microsoft.com/beta/education/users/${studentId}?$select=id,relatedContacts`

    resp = await axios
        .get(url , {
            headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer ' + accessToken }
        });
    console.log("response from get contacts", resp.data.relatedContacts);

    return resp.data.relatedContacts;
}

const getAccessToken = async() => {
    clientId = "cd6061e4-1900-4425-8075-15ecd3583f26"
    tenantId = "f68c41a8-e0f0-4573-a6ff-a0fc663ab214"
    clientSecret = "nOh8Q~CCPGlECB9FX4T6bYmuvcHpPFJBXsgUCbVK"

    tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`
    
    const postData = {
        client_id: clientId,
        scope: "https://graph.microsoft.com/.default",
        client_secret: clientSecret,
        grant_type: 'client_credentials'
    };
        
    axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded';
    
    resp = await axios.post(tokenEndpoint, qs.stringify(postData));
    return resp.data.access_token
}

module.exports = {updateRelatedContacts};
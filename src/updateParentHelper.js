const axios = require('axios');
const { response } = require('express');
const qs = require('qs')

const getOnedriveFile = async(sharepointLink) => {
    const decodedLink = sharepointLink
    encodedLink = Buffer.from(decodedLink).toString('base64');
    encodedLink = "u!" + encodedLink.slice(0,-1);

    accessToken = await getAccessToken();
    options = {
        url: "https://graph.microsoft.com/v1.0/shares/" + encodedLink + "/driveitem",
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
    };

    // url = "https://graph.microsoft.com/v1.0/shares/" + encodedLink + "/driveitem"

    // axios.defaults.headers.get['Authorization'] = "Bearer "+ accessToken
    resp = await axios.request(options)
    downloadableLink = resp.data['@microsoft.graph.downloadUrl'];
    csv = await axios.get(downloadableLink);
    let array = csv.data.split("\r\n").map(function (line) {
        return line.split(",");
    });
    return array;
}

const getAccessToken = async() => {
    clientId = "725d8093-4cf6-49cf-a4a6-ecd2a4e9ae40"
    tenantId = "f68c41a8-e0f0-4573-a6ff-a0fc663ab214"
    clientSecret = "2Ib8Q~pgTZk6VS8v9xd2e8gJsi2rQ3AESQGcgcp1"

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

const getSharepointLink = async(approvalId) => {
    accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IjFWdVF6QldFbmZCVDJoMk94b1ZmRS0zMkNzR1pWWmpuZUllTEt1U19mOEEiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mNjhjNDFhOC1lMGYwLTQ1NzMtYTZmZi1hMGZjNjYzYWIyMTQvIiwiaWF0IjoxNjc2NjExMzIwLCJuYmYiOjE2NzY2MTEzMjAsImV4cCI6MTY3NjYxNjQ1OSwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iXSwiYWlvIjoiRTJaZ1lPQ3lVSy9mcWZ1MThyc0twL3RueTlRa2ljUC9DajVWbTExajhicndNRVczdUJJQSIsImFtciI6WyJwd2QiXSwiYXBwX2Rpc3BsYXluYW1lIjoiUGFyZW50cyBUZXN0IEFwcCIsImFwcGlkIjoiZTk3ZmM2ZTMtMmI4NS00NTJjLWFlMTYtYjA1MGJlZTA0Y2MxIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiIoSVQpIiwiZ2l2ZW5fbmFtZSI6IkJydW5vIiwiaGFzd2lkcyI6InRydWUiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxNjcuMjIwLjIzOC43MyIsIm5hbWUiOiJCcnVubyAoSVQpIiwib2lkIjoiZjQ4NzFjNDYtNWQ1Yy00MWY3LTk5NzEtNzczZGU0YTI2NGEwIiwicGxhdGYiOiI1IiwicHVpZCI6IjEwMDMyMDAxMTE5OUUzMjMiLCJyaCI6IjAuQVh3QXFFR005dkRnYzBXbV82RDhaanF5RkFNQUFBQUFBQUFBd0FBQUFBQUFBQUI4QUJnLiIsInNjcCI6IkFwcHJvdmFsU29sdXRpb24uUmVhZCBBcHByb3ZhbFNvbHV0aW9uLlJlYWRXcml0ZSBBcHByb3ZhbFNvbHV0aW9uUmVzcG9uc2UuUmVhZFdyaXRlIFVzZXIuUmVhZCBwcm9maWxlIG9wZW5pZCBlbWFpbCIsInN1YiI6IkNiSVdCWGY5c096cFhkQ1Z6S0xFMzUybzhOUjBIZHpvNm96bkdmREZtcUkiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiJmNjhjNDFhOC1lMGYwLTQ1NzMtYTZmZi1hMGZjNjYzYWIyMTQiLCJ1bmlxdWVfbmFtZSI6ImFkbWluQE0zNjVFRFU1NzMwNTYub25taWNyb3NvZnQuY29tIiwidXBuIjoiYWRtaW5ATTM2NUVEVTU3MzA1Ni5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJUQlBiaEowVTVFS2RDZk5xajBIREFBIiwidmVyIjoiMS4wIiwieG1zX3N0Ijp7InN1YiI6IlpwTUNnRnZnek56SVR6SlM2bEZDMVk4WU1pOFN1QXh0bGRQOEg1WHRiMGsifSwieG1zX3RjZHQiOjE2MTE5MjA5NDB9.IoTJ7QwfUz2Q5f0Mrpxzv99sErqvVEtWSuddjg_OLvEgb9rsx2UjTm1aYtjbhQ4CX0gA81OKHRkl7mbXsqR6ES6VEvYSdAQAWrs571QWEcUS-_CP_71RlTO0O4Je5Rs-XRu9zN2Qm87XPaeTzHbGdXWvL09K6vdwx3-C-NE-nxQiYk-oMraGE2dv3MyLdv54YSTg2GRBzZoRJsa0FTaGBSJBhr2yAF5i_A8UZ2a5M-o_9Z0lu6PbwyxiNntfABxRhV6PvffwZf1kzdMi8jcAUrTEoF030TATAgbNw3RYX2m7YuVREQTcTYZUsVwH5rorD0-yWMGK5Mtn7O35fo14eg"
    url = "https://graph.microsoft.com/beta/solutions/approval/approvalItems/" + approvalId
    resp = await axios.get(url, {headers: {Authorization: "Bearer " + accessToken}})
    sharepointLink = resp.data.description;
    console.log(sharepointLink);
    return sharepointLink;
}

const updateRelatedContacts = async(data) => {
    accessToken = await getAccessToken();
    for(i = 1; i<data.length; i++){
        body = {
            "relatedContacts": [
                {
                    displayName: data[i][1],
                    emailAddress: data[i][2],
                    mobilePhone: data[i][3],
                    relationship: "guardian",
                    accessConsent: true
                }
            ]
        }
        url = "https://graph.microsoft.com/beta/education/users/" + data[i][0]
        console.log(url);
        options = {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        }

        resp = await axios
        .patch(url, body , {
            headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer ' + accessToken }
        });
        console.log(resp.status);
    }
    console.log("updated data successfully");
}

const processRequest = async(approvalId) => {
    sharepointLink = await getSharepointLink(approvalId);
    data = await getOnedriveFile(sharepointLink);
    updateRelatedContacts(data);
}

module.exports = {processRequest}
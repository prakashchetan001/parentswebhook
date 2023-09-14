const { EmailClient, KnownEmailSendStatus } = require("@azure/communication-email");
require("dotenv").config();

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const emailClient = new EmailClient(connectionString);

const senderAddress = 'donotreply@adfe6cea-b4fd-4de8-a5f8-deea7e1b9e12.azurecomm.net';
const recipientAddress = [{address: 'rvardiyani@microsoft.com'},{address: 'poojabansal@microsoft.com'},{address: 'chprakas@microsoft.com'}]
//const replyToAddress = "<REPLY_TO_EMAIL_ADDRESS>"

export async function main(recipientAddress,customerName,uniqueCode,) {
  const POLLER_WAIT_TIME = 10
  try {
    const message = {
      senderAddress: "donotreply@adfe6cea-b4fd-4de8-a5f8-deea7e1b9e12.azurecomm.net",
      content: {
        subject: "This is your Unique Code for Parental Consent",
        plainText: ` Hii ${customerName}, Your unique code is ${uniqueCode}`,
      },
      recipients: {
        to: [
          {
            address: recipientAddress,
          },
        ],
      },
    };

    const poller = await emailClient.beginSend(message);

    if (!poller.getOperationState().isStarted) {
      throw "Poller was not started."
    }

    let timeElapsed = 0;
    while(!poller.isDone()) {
      poller.poll();
      console.log("Email send polling in progress");

      await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
      timeElapsed += 10;

      if(timeElapsed > 18 * POLLER_WAIT_TIME) {
        throw "Polling timed out.";
      }
    }

    if(poller.getResult().status === KnownEmailSendStatus.Succeeded) {
      console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`);
    }
    else {
      throw poller.getResult().error;
    }
  } catch (e) {
    console.log(e);
  }
}

main();
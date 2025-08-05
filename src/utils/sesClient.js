const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "ap-south-1";
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: "Vasu@123",
    secretAccessKey: "Vasu@123",
  },
});

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]

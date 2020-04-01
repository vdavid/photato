# Photato website
This is a website meant to be put to https://photato.eu

Also see the frontend's README.md

Technology used:
- Handles auth via Auth0
- Call an AWS Lambda backend, deployed by Serverless.

## Installation

### Set up Serverless

1. Install Serverless globally:

   ```bash
   npm install -g serverless
   ```

2. Allow it to access AWS.
   You'll need to add your AWS access key and secret to the command.
   
   If you have no user yet, set it up here:
https://console.aws.amazon.com/iam/home?region=eu-central-1
I suppose it needs "AdministratorAccess" privileges, that's what I gave it:

   ```bash
   serverless config credentials --provider aws --key {ACCESS_KEY} ?secret {SECRET_KEY}
   ```

3. Log in to Serverless Dashboard.

   ```bash
   serverless login
   ```

## Development

Logs are here: https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logStream:group=/aws/lambda/photato-website-backend-dev-uploadToS3;streamFilter=typeLogStreamPrefix

### Adding a new back-end service

Use this one to create a Node.js-based AWS service
```bash
sls create --template aws-nodejs --path {myService}
```
 
## Features

## Links

 - GitHub: https://github.com/vdavid/photato-website-backend/

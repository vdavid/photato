# Photato website
This is a website meant to be put to https://photato.eu

Technology used:
 - AWS Lambda backend via Lambda@Edge (related: [why the weird response headers](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html))
 - [Serverless](https://serverless.com) for the deployment.

For the single-use upload URLs, got a lot of inspiration from this [article](https://serverless.com/blog/s3-one-time-signed-url/) and the related [repository](https://github.com/laardee/one-time-presigned-url).

See also the frontend’s README.md

## Installation

### Set up AWS

- Log in to the Serverless Dashboard and connect it to AWS
- Follow [this article](https://www.albertgao.xyz/2020/02/26/how-to-resolve-require-the-cfnrole-option-warning-for-serverless-framework/)
  to create this role: `arn:aws:iam::633371514237:role/cloudformation-role` that has to be added as the `cfnRole`
  in `serverless.yml` to avoid a warning. 

### Set up Serverless

1. Install Serverless globally:

   ```bash
   pnpm install -g serverless
   ```

2. Allow it to access AWS.
   You'll need to add your AWS access key and secret to the command.
   
   If you have no user yet, set it up here:
https://console.aws.amazon.com/iam/home?region=us-east-1
I suppose it needs "AdministratorAccess" privileges, that's what I gave it:

   ```bash
   serverless config credentials --provider aws --key {ACCESS_KEY} --secret {SECRET_KEY}
   ```

3. Log in to Serverless Dashboard.

   ```bash
   serverless login
   ```

### Mongo
A “users” collection will be auto-created, but an index on it is needed for "sessions.auth0AccessToken".

## Development

Logs are here: https://us-east-1.console.aws.amazon.com/cloudwatch/home

AWS JS API docs are quite useful: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS.html

### Adding a new back-end service

Use this one to create a Node.js-based AWS service
```bash
sls create --template aws-nodejs --path {myService}
```

### Testing

It uses Jest. To run them, just run:

```bash
pnpm test
```

## Deployment

Be careful because things take time (can be 45 minutes) to propagate, so definitely run the tests before deploying.

```bash
npx serverless deploy
```

## Features

A number of Lambda functions.

### Get signed URL

Returns a signed URL 

### Validate signed URL

### Get image


## Links

 - GitHub: https://github.com/vdavid/photato-website-backend/

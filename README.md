# Serverless Development Workshop

In this workshop, we'll deploy a simple serverless application which generates Doge meme images,
randomly choosing colors and locations of text, writing an image into an S3 bucket.

This will create an API that can be used by web services or users to generate doge images,
while consuming no dedicated or long-lived resources besides space on S3.

![Doge image](https://s3.amazonaws.com/iopipe-workshop-doge-2/doge-996.jpg)


# Preparation:

1. Access to a MacOS or Linux machine. These instructions are not tested on Windows; users may need to make small adaptations or run these commands inside of a Docker container or Linux VM. ([Install Docker for Windows](https://docs.docker.com/docker-for-windows/))
2. Amazon Web Services account. Creation of an account is free and various services are provided under a free-tier, although a credit card is required at the time of account creation. AWS Lambda is free for up to 1 million invocations per month, for all users, which is more than sufficient for this course. Storage of functions may incur small fees (normally pennies / month).  Students are solely responsible for their AWS bill and all charges incurred as a result of this course.
3. Install NodeJS 4.4.3 or higher: [NodeJS downloads](https://nodejs.org/en/)
4. Curl (you probably have this already! Curl ships with MacOS and is easily installed via Linux package managers.

# System configuration

* Create ~/.aws/credentials (manually or via `aws-cli configure`), or set environment variables:

```
export AWS_ACCESS_KEY_ID=<key>
export AWS_SECRET_ACCESS_KEY=<secret>
```

# Serverless Framework

There are several frameworks for building so-called "serverless" applications. The most
popular one is called, aptly, [The Serverless Framework](http://www.serverless.com). Other
frameworks can be found on this [fairly exhaustive list](https://github.com/anaibol/awesome-serverless).

For the sake of convenience, we'll settle using TheServerlessFramework with a NodeJS application for this workshop.

* Install module: `sudo npm install -g serverless@beta`
* Create project directory: `mkdir iopipe-workshop; cd iopipe-workshop`
* Create! `serverless create --template aws-nodejs` also see [alternatives to nodejs](https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates)
* Deploy! `serverless deploy`
* Test!   `serverless invoke --function hello -p event.json`

# Deploy a real app!

We've prepared an example project for you to test!

Checkout this repo:

```
$ git clone https://github.com/iopipe/lambda-workshop
```

## Install npm modules

```
$ npm install
```

## Re-name the project!

Edit `serverless.yml` and `doge.js` to change `iopipe-workshop-doge-1` to a unique name.

```
$ sed -i "s/iopipe-workshop-doge-1/iopipe-workshop-doge-$(($RANDOM*$RANDOM))/g" doge.js serverless.yml
# On OS X: sed -i "" -e "s/iopipe-workshop-doge-1/iopipe-workshop-doge-$(($RANDOM*$RANDOM))/g" doge.js serverless.yml
```

## Deploy the app:

```
$ serverless deploy
```

## Configure the IAM policy for the function:

This function uploads files into Amazon S3. To accomplish this, the Lambda function must
be granted permission to the S3 bucket.

- Go into the IAM policy editor, click `Roles`.
- Select the role which looks like, `iopipe-workshop-doge-1-dev-IamRoleLambda-`
- Click `Attach Policy` and select `AmazonS3FullAccess`.

## Execute the lambda function:

```
$ serverless invoke --function create -p event.json
```

A URL should be printed to your console. Visit this in your browser. Edit event.json to change the
text overlaid onto the image.

Edit the code and do fun things!

# IOpipe account

While not critical for a doge-text app, more serious applications, including
ChatBots, Voice assistents, production web services, etc. will benefit from
Application Performance Monitoring & Management (APM).

IOpipe is offering free beta access to an APM service designed specifically
for serverless applications.

* `npm install --save iopipe`
* Import & configure the module:

```
/* Get client-id token from https://dashboard.iopipe.com */
var iopipe = require("iopipe")({ clientId: "my-client-id-here" })
```

* Modify the handler, wrapping the function declaration with iopipe(). Make sure to close the parens by placing a `)` character after the final `}` character.

```
module.exports.create = iopipe((event, context, cb) => {
  ...
})
```

* Redeploy: `serverless deploy`
* Invoke function: `serverless invoke --function create -p event.json`
* Check [dashboard](https://dashboard.iopipe.com)

# Extra homework!

This is actually a functioning Slackbot! If you have admin permission on a Slack, you can add this as a /doge slash command!

- Visit [Custom Integrations](https://iopipe.slack.com/apps/manage/custom-integrations), choose 'Slash Commands', then 'Add Configuration'.
- Specify the command `/doge` and click, `Add Integration`.
- Provide the URL given by `serverless deploy`
- Specify `GET` as the HTTP method.
- Click `Save Integration`

Now you can type `/doge this text gets printed onto your doge!`

# Delete resources

We have created various resources during this course. You may, of course, keep these applications and resources deployed, but you may incur small fees from Amazon in doing so. Make sure to delete all AWS Lambda functions, S3 objects, S3 buckets, and other resources created during this course using your AWS console. If in doubt, check the Billing "Service" in your AWS Console.

Resources will have been created under IAM roles, Lambda functions, S3 buckets, API Gateway, and Cloudformation. Simply deleting the cloud formation resources is usually enough, but again, double-check!

The following command *should* remove all resources:

```
$ serverless remove
```

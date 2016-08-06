# Serverless Development Workshop

Preparation:

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

Execute the lambda function, saving the output to a file:

```
$ serverless invoke --function create -p event.json > my_doge.jpg
```

Open `my_doge.jpg` in an image viewer. Edit event.json to change the
text overlaid onto the image.

Edit the code and do fun things!

# IOpipe account

While not critical for a doge-text app, more serious applications, including
ChatBots, Voice assistents, production web services, etc. will benefit from
Application Performance Monitoring & Management (APM).

IOpipe is offering free beta access to an APM service designed specifically
for serverless applications.

* `cd iopipe-workshop`
* `npm install --save iopipe`
* Add code:

```
/* Get client-id token from https://dashboard.iopipe.com */
require("iopipe")({ clientId: "my-client-id-here" })
exports.handler = iopipe(
  function(event, context, callback) => {
    callback("Hello world!")
  }
)
```

* Invoke function again: `serverless invoke --function hello -p event.json`
* Check [dashboard](https://dashboard.iopipe.com)

# Delete resources

We have deleted various resources during this course. You may, of course, keep these applications and resources deployed, but you may incur small fees from Amazon in doing so. Make sure to delete all AWS Lambda functions, S3 objects, S3 buckets, and other resources created during this course using your AWS console. If in doubt, check the Billing "Service" in your AWS Console.
